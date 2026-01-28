const { UnauthorizedError } = require('../errors');
const userModel = require('../models/userModel');

const isVerified = async (req, res, next) => {
  const { userId } = req.user;
  const user = await userModel.findById(userId);
  if (user.isVerified === false) {
    throw new UnauthorizedError('Your email is not verified yet. Please verify your email first!');
  }
  next();
};

module.exports = isVerified;