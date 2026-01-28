const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const userModel = require('../models/userModel');

/**
 * Authenticates a user by validating their JWT token
 * @param {Request} req - Express request object containing the JWT token in the authorization header
 * @param {Response} res - Express response object used to send back the user details
 * @param {Function} next - Express next middleware function
 * @throws {UnauthenticatedError} When the JWT token is invalid or missing
 */
const authenticate = async (req, res, next) => {
  // Todo: fix when the user does not exist the error is not thrown
  const token = req.cookies.token;
  // Check if the authorization cookie is present
  if (!token) {
    throw new UnauthenticatedError(`Please log in first`);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(payload.userId);
    if (!user) {
      throw new Error();
    }
    // Add the user id and user name to the request object
    req.user = { userId: payload.userId, userName: payload.userName };
  }
  catch {
    throw new UnauthenticatedError(`Please log in first`);
  }
  next();
};

module.exports = authenticate;