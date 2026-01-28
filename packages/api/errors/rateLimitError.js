const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./customApiError");

class RateLimitError extends CustomApiError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.TOO_MANY_REQUESTS;
  }
}

module.exports = RateLimitError;