const resultModel = require('../models/resultModel');
const { PaymentRequiredError, NotFoundError } = require('../errors');

/**
 * Middleware to verify if a user has completed the payment for their assessment results.
 * * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.user - The authenticated user object.
 * @param {string} req.user.userId - The unique identifier of the user.
 * @param {Function} req.t - Internationalization (i18n) translation function.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * * @throws {NotFoundError} If no result record is found for the given userId.
 * @throws {PaymentRequiredError} If the result exists but the isPaid flag is not true.
 * * @returns {Promise<void>} Calls the next middleware if validation passes.
 */
const hasPaid = async (req, res, next) => {
  const { userId } = req.user;
  const result = await resultModel.findOne({ userId: userId }).select('isPaid').lean(); // Select isPaid filed only to improve the performance
  if (!result) {
    throw new NotFoundError(req.t('userDoesNotHaveResult'));
  }
  if (result.isPaid !== true) {
    throw new PaymentRequiredError(req.t('paymentRequired'));
  }
  next();
};

module.exports = hasPaid;