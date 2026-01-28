const BadRequestError = require('./badRequestError');
const NotFoundError = require('./notFoundError');
const customApiError = require('./customApiError');
const UnauthenticatedError = require('./unauthenticatedCustomError');
const UnauthorizedError = require('./unauthorizedCustomError');
const ForbiddenError = require('./forbiddenError');
const RateLimitError = require('./rateLimitError');
const InvalidPasswordError = require('./invalidPasswordError');

module.exports = {
  NotFoundError, BadRequestError, customApiError, UnauthenticatedError, UnauthorizedError, ForbiddenError, RateLimitError, InvalidPasswordError
};