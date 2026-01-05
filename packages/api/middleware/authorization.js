const userModel = require('../models/userModel');
const { UnauthorizedError } = require('../errors');
const userRoles = require('../enums/userRoles');

const authorize = (...roles) => {
  return async (req, res, next) => {
    const userId = req.user.userId;
    const user = await userModel.findById(userId);
    if (!roles.includes(user.role)) {
      throw new UnauthorizedError('You are not authorized to perform this action');
    }
    next();
  };
};

module.exports = authorize;