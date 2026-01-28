const { MongooseError } = require("mongoose");
const { customApiError, InvalidPasswordError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const handler = (err, req, res, next) => {
  // Check for the custom errors
  if (err instanceof customApiError) {
    if (err instanceof InvalidPasswordError) {
      return res.status(err.status).json({ msg: req.t(err.message) });
    }
    return res.status(err.status).json({ msg: err.message });
  }
  // Check for mongoose errors
  if (err instanceof MongooseError) {
    // Check for mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: req.t(messages[0]) });
    }
    // Check for mongoose casting
    else if (err.name === "CastError") {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: `${req.t('invalidValue')}: ${err.value}!` });
    }
  }
  // Check for mongoose unique validation errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    // notify the user that this account already exist
    if (field === "email" || field === "userName") {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: req.t('accountExist') });
    }
    // if the field is not the username or email then just notify the user to change the value
    else {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: `${field} ${req.t('mustBeUnique')}` });
    }
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: req.t('serverError') });
};

module.exports = handler;