const CustomApiError = require("./customApiError");
const { StatusCodes } = require("http-status-codes");

class InvalidPasswordError extends CustomApiError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  };
}

module.exports = InvalidPasswordError;