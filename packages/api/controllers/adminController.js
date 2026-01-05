const { StatusCodes } = require("http-status-codes");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
const { BadRequestError, NotFoundError } = require("../errors");
const userRoles = require("../enums/userRoles");
const mongoose = require("mongoose");

/**
 * Gets all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The response object
 */
const GetUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const usersTotal = await userModel.countDocuments({});
  const users = await userModel.find({})
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
      throw new NotFoundError(`User with id ${id} does not exist`);
    }
    if (user.role === role) {
      throw new BadRequestError(`User with id ${id} already has role ${role}`);
    }
    if (role === userRoles.SUPER_ADMIN) {
      await userModel.findOneAndUpdate({ role: userRoles.SUPER_ADMIN }, { role: userRoles.ADMIN }).session(session);
    }
    user.role = role;
    await user.save({ session: session });
    await session.commitTransaction();
    res.status(StatusCodes.OK).json({ status: 'Success' });
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
    throw new NotFoundError(`Comment with id ${id} does not exist`);
  }
  res.status(StatusCodes.OK).json({ status: 'Success' });
};

module.exports = { GetUsers, ChangeRole, DeleteUserComment }; 
