const crypto = require('crypto');
const { CreateOrder, CapturePayment, GetOwnedPayment } = require("../helperMethods/paymentManager");
const product = require('../constants/product');
const { StatusCodes } = require("http-status-codes");
const paymentModel = require('../models/paymentModel');
const resultModel = require('../models/resultModel');
const paymentStatus = require('../enums/paymentStatus');
const mongoose = require('mongoose');
const { BadRequestError } = require('../errors');

/**
 * @description Creates a new checkout session and stores the payment record for the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object containing userId.
 * @param {string} req.user.userId - ID of the user starting the checkout flow.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing the PayPal approval url.
 */
const StartCheckout = async (req, res) => {
  const { userId } = req.user;
  const checkoutState = crypto.randomBytes(32).toString('hex'); // This field is used to prevent CSRF attacks.
  const { url, orderId } = await CreateOrder(product.PERSONALITY_TEST, checkoutState);
  const { price: amount, currency } = product.PERSONALITY_TEST;
  await paymentModel.create({ orderId, checkoutState, userId, amount, currency });
  res.status(StatusCodes.OK).json({ url });
};

/**
 * @description Completes the payment transaction for the authenticated user's checkout session.
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object containing userId.
 * @param {string} req.user.userId - ID of the user completing the checkout flow.
 * @param {Object} req.query - Query parameters returned from PayPal.
 * @param {string} req.query.token - The PayPal order id.
 * @param {string} req.query.state - The checkout state generated when the order was created.
 * @param {Object} res - Express response object.
 * @redirects Redirects the user to the result page when the payment has already been completed or is captured successfully.
 * @throws {BadRequestError} When the user attempts to complete a checkout session that has already been canceled.
 */
const CompleteCheckout = async (req, res) => {
  const { token, state } = req.query;
  const { userId } = req.user;
  const existingPayment = await GetOwnedPayment(token, state, userId, req.t);

  if (existingPayment.status === paymentStatus.CANCELED) {
    throw new BadRequestError(req.t('CompletingCancelledOrder'));
  }

  if (existingPayment.status === paymentStatus.COMPLETED) {
    return res.redirect(`${process.env.FRONTEND_URL}/result`);
  }

  // 2. External Call: Capture with PayPal
  const response = await CapturePayment(token);

  // 3. Handle both 201 (First time) and 200 (Idempotent Retry)
  if (response.status === StatusCodes.CREATED || response.status === StatusCodes.OK) {

    // Ensure the internal PayPal status is actually COMPLETED
    if (response.data.status === 'COMPLETED') {

      // 1. Start the session
      const session = await mongoose.startSession();

      try {
        // 2. Execute operations within withTransaction
        await session.withTransaction(async () => {

          // Save the payment
          // Update Payment History
          existingPayment.status = paymentStatus.COMPLETED;
          await existingPayment.save({ session });

          //  Unlock the result
          await resultModel.findOneAndUpdate(
            { userId: userId },
            { isPaid: true },
            { session, new: true }
          );

        });
      } catch (error) {
        // withTransaction automatically aborts the transaction on error
        throw error;
      } finally {
        // 3. End the session to free up resources
        await session.endSession();
      }
      return res.redirect(`${process.env.FRONTEND_URL}/result`);
    }
  }

  // 4. Fallback for failed captures
  return res.status(StatusCodes.PAYMENT_REQUIRED).json({ msg: req.t('paymentFailed') });
};

/**
 * @description Cancels the authenticated user's checkout session.
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object containing userId.
 * @param {string} req.user.userId - ID of the user canceling the checkout flow.
 * @param {Object} req.query - Query parameters returned from PayPal.
 * @param {string} req.query.token - The PayPal order id.
 * @param {string} req.query.state - The checkout state generated when the order was created.
 * @param {Object} res - Express response object.
 * @redirects Redirects the user to the test page after the payment record is marked as canceled.
 */
const CancelCheckout = async (req, res) => {
  const { token, state } = req.query;
  const { userId } = req.user;

  const payment = await GetOwnedPayment(token, state, userId, req.t);
  if (payment.status === paymentStatus.COMPLETED) {
    throw new BadRequestError(req.t('CancellingCompletedOrder'));
  }
  payment.status = paymentStatus.CANCELED;
  await payment.save();
  return res.redirect(`${process.env.FRONTEND_URL}/test`);
};

module.exports = { StartCheckout, CompleteCheckout, CancelCheckout };
