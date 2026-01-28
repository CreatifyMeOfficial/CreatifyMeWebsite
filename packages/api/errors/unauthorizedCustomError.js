const CustomApiError = require("./customApiError");
const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.FORBIDDEN;
  }
}


module.exports = UnauthorizedError;