const axios = require('axios');
const { BadRequestError, UnauthorizedError } = require('../errors');
const paymentModel = require('../models/paymentModel');


/**
 * Retrieves an OAuth2 access token from PayPal using client credentials from environment variables.
 * @async
 * @function GetAccessToken
 * @returns {Promise<string>} Returns a Promise that resolves to the access token string.
 */

const GetAccessToken = async () => {
  const response = await axios({
    url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    method: 'post',
    data: 'grant_type=client_credentials',
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET
    },
  });
  return response.data.access_token;
};

/**
 * Retrieves the payment record for the given order and verifies that it belongs to the current user.
 *
 * This function performs the following steps:
 * 1. Validates that both the PayPal order id and checkout state are present.
 * 2. Loads the payment record that matches the provided order id.
 * 3. Confirms that the saved payment belongs to the authenticated user and that the checkout state matches.
 * 4. Returns the validated payment document for further processing.
 *
 * @async
 * @function GetOwnedPayment
 * @param {string} orderId - The PayPal order id returned in the callback request.
 * @param {string} checkoutState - The opaque checkout state value generated when the order was created.
 * @param {string} userId - The id of the authenticated user completing the checkout flow.
 * @param {Function} t - The i18n translation function used to build localized error messages.
 * @returns {Promise<Object>} The payment document that matches the provided order id and belongs to the authenticated user.
 * @throws {BadRequestError} Throws when the order id or checkout state is missing, or when no matching payment record exists.
 * @throws {UnauthorizedError} Throws when the payment record does not belong to the authenticated user or the checkout state does not match.
 */
const GetOwnedPayment = async (orderId, checkoutState, userId, t) => {
  if (!orderId || !checkoutState) {
    throw new BadRequestError(t('InvalidCheckoutSession'));
  }

  const payment = await paymentModel.findOne({ orderId });
  if (!payment) { // Validate if there is a payment record that correspond to this order id
    throw new BadRequestError(t('InvalidCheckoutSession'));
  }

  if (payment.userId.toString() !== userId || payment.checkoutState !== checkoutState) { // Check if the saved payment user id and checkout state match the provided ones to prevent CSRF attacks
    throw new UnauthorizedError(t('UnauthorizedCheckoutSession'));
  }

  return payment;
};

/**
 * Creates a new PayPal order (checkout session) for the given product.
 *
 * This function performs the following steps:
 * 1. Retrieves an OAuth2 access token from PayPal using the GetAccessToken function (credentials are read from environment variables).
 * 2. Prepares purchase details for the provided product object (expects fields: name, description, quantity, price, currency).
 * 3. Constructs and sends a request to PayPal's /v2/checkout/orders endpoint to create an order.
 * 4. Configures the checkout experience context, specifying payment method,  user action, and return/cancel URLs.
 * 5. Returns PayPal's API response, which includes the order ID and approval links.
 *
 * @async
 * @function CreateOrder
 * @param {Object} product - The product object describing the checkout item.
 * @param {string} product.name - Name of the product.
 * @param {string} product.description - Description of the product.
 * @param {string|number} product.quantity - Quantity of the product being purchased.
 * @param {string|number} product.price - Unit price of the product.
 * @param {string} product.currency - Currency code (e.g., "USD").
 * @param {string} checkoutState - Opaque state value used to verify the returning browser belongs to the same checkout session.
 * @returns {Promise<Object>} The full PayPal API response for order creation.
 * @throws {Error} Throws if the PayPal API call fails or a network error occurs.
 */
const CreateOrder = async (product, checkoutState) => {
  const { name, description, quantity, price, currency } = product;
  const accessToken = await GetAccessToken();
  const completeOrderUrl = new URL(`${process.env.BASE_URL}/payment/complete-order`);
  completeOrderUrl.searchParams.set('state', checkoutState);
  const cancelOrderUrl = new URL(`${process.env.BASE_URL}/payment/cancel-order`);
  cancelOrderUrl.searchParams.set('state', checkoutState);
  const response = await axios({
    url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    data: {
      intent: "CAPTURE",
      application_context: {
        brand_name: "Creatify Me"
      },
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: completeOrderUrl.toString(),
            cancel_url: cancelOrderUrl.toString()
          },
        },
      },
      purchase_units: [
        {
          items: [
            {
              name: name,
              description: description,
              quantity: quantity,
              unit_amount: {
                currency_code: currency,
                value: price,
              },
            },
          ],
          amount: {
            currency_code: currency,
            value: price,
            breakdown: {
              item_total: {
                currency_code: currency,
                value: price,
              },
            },
          },
        },

      ],
    },
  });
  return {
    url: response.data.links.find(link => link.rel === 'payer-action').href,
    orderId: response.data.id
  };
};

/**
 * CapturePayment
 * 
 * Captures payment for an approved PayPal order.
 * 
 * @param {string} orderId - The PayPal order ID to capture payment for.
 * @returns {Promise<Object>} The PayPal API response with the captured payment details.
 * 
 * This function retrieves an access token and calls the PayPal capture endpoint for the given orderId.
 * It is typically called after the payer has approved the payment on PayPal.
 * 
 * Example usage:
 * 
 *   const captureResponse = await CapturePayment(orderId);
 *   console.log(captureResponse); // Contains details about the captured payment
 */

const CapturePayment = async (orderId) => {
  const accessToken = await GetAccessToken();

  const response = await axios({
    url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    method: 'post',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      // Use the orderId as the Idempotency Key to prevent double-charging
      "PayPal-Request-Id": orderId,
    },
  });
  return response;
};

module.exports = {
  CreateOrder,
  CapturePayment,
  GetOwnedPayment
};
