const { StatusCodes } = require("http-status-codes");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
const { BadRequestError, NotFoundError } = require("../errors");
const userRoles = require("../enums/userRoles");
const mongoose = require("mongoose");


/**
 * Retrieves a paginated list of users, optionally filtered by username.
 * @param {Object} req - The request object containing the search filters
 * @param {Object} res - The response object
 * @returns {Object} The response object containing the list of users depending on
 *  the pagination filters 
 * and the users total in the whole database
 * (the total will be effected by the username filter value)
 */
const GetUsers = async (req, res) => {
  const { page = 1, limit = 10, userName } = req.query;
  let filter = {};
  // Check if the username is not empty
  if (userName) {
    // search if the username contains this series of characters 
    // 'i' makes the search case insensitive
    filter.userName = { $regex: userName, $options: 'i' };
  }
  // Get the total of the users that match the search filter
  const usersTotal = await userModel.countDocuments(filter);
  // Get paginated list of users that match the search filter
  const users = await userModel.find(filter)
    .select('userName firstName lastName email role birthdate image')
    .skip((page - 1) * limit)
    .limit(limit);
  res.status(StatusCodes.OK).json({ users: users, total: usersTotal });
};

/**
 * Changes the role of a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The response object
 */
const ChangeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await userModel.findById(id).session(session);
    if (!user) {
      throw new NotFoundError(req.t('userDoesNotExist'));
    }
    if (user.role === userRoles.SUPER_ADMIN) {
      throw new BadRequestError(req.t('adminCanNotChangeHisRole'));
    }
    if (user.role === role) {
      throw new BadRequestError(req.t('userHasRole'));
    }
    if (role === userRoles.SUPER_ADMIN) {
      await userModel.findOneAndUpdate({ role: userRoles.SUPER_ADMIN }, { role: userRoles.ADMIN }).session(session);
    }
    user.role = role;
    await user.save({ session: session });
    await session.commitTransaction();
    res.status(StatusCodes.OK).json({ msg: req.t('userRoleUpdateSuccessfully') });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

/**
 * Deletes a user's comment
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The response object
 */
const DeleteUserComment = async (req, res) => {
  const { id } = req.params;
  const comment = await commentModel.findByIdAndDelete(id);
  if (!comment) {
    throw new NotFoundError(req.t('commentDoesNotExist'));
  }
  res.status(StatusCodes.OK).json({ msg: req.t('commentDeletedSuccessfully') });
};

module.exports = { GetUsers, ChangeRole, DeleteUserComment }; 
