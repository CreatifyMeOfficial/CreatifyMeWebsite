const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./customApiError");

class PaymentRequiredError extends CustomApiError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.PAYMENT_REQUIRED;
  }
}

module.exports = PaymentRequiredError;