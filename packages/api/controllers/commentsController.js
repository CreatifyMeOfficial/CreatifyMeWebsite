const { StatusCodes } = require("http-status-codes");
const commentModel = require("../models/commentModel");
const { NotFoundError, UnauthorizedError } = require("../errors");
const { filterWords } = require("../helperMethods/wordsFilter");

/**
 * Creates a new comment for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object containing userId
 * @param {Object} req.body - Request body containing comment text
 * @param {string} req.body.comment - The comment text to create
 * @param {Object} res - Express response object
 * @returns {Object} Success status on comment creation
 */
const CreateComment = async (req, res) => {
  const { userId } = req.user;
  const { comment } = req.body;
  await filterWords(comment);
  const userComment = await commentModel.create({ createdBy: userId, comment: comment });
  res.status(StatusCodes.CREATED).json({ msg: req.t('commentCreatedSuccessfully') });
};

/**
 * Retrieves all comments for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object containing userId
 * @param {Object} res - Express response object
 * @returns {Object} Object containing array of user's comments with populated creator details
 */
const GetUserComments = async (req, res) => {
  const { userId } = req.user;
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const commentsTotal = await commentModel.countDocuments({ createdBy: userId });
  const userComments = await commentModel.find({ createdBy: userId })
    .populate('createdBy', 'userName image -_id')
    .select('comment createdAt')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
  res.status(StatusCodes.OK).json({ comments: userComments, commentsTotal: commentsTotal });
};

/**
 * Retrieves all comments in the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Object containing array of all comments with populated creator details
 */
const GetAllComments = async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const commentsTotal = await commentModel.countDocuments({});
  const comments = await commentModel.find()
    .populate('createdBy', 'userName image -_id')
    .select('comment createdAt')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
  res.status(StatusCodes.OK).json({ comments: comments, commentsTotal: commentsTotal });
};


/**
 * Deletes a specific comment belonging to the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object containing userId
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - ID of the comment to delete
 * @param {Object} res - Express response object
 * @returns {Object} Success status on comment deletion
 * @throws {NotFoundError} If comment doesn't exist or doesn't belong to user
 */
const DeleteUserComment = async (req, res) => {
  const { userId } = req.user;
  const { id: commentId } = req.params;
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    throw new NotFoundError(req.t('commentDoesNotExist'));
  }
  if (comment.createdBy.toString() !== userId) {
    throw new UnauthorizedError(req.t('commentDeleteNotAllowed'));
  }
  await comment.deleteOne();
  res.status(StatusCodes.OK).json({ msg: req.t('commentDeletedSuccessfully') });
};

/**
 * Updates a specific comment belonging to the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object containing userId
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - ID of the comment to update
 * @param {Object} req.body - Request body containing the updated comment text
 * @param {string} req.body.comment - The new comment text
 * @param {Object} res - Express response object
 * @returns {Object} Success status on comment update
 * @throws {NotFoundError} If the comment doesn't exist
 * @throws {UnauthorizedError} If the comment does not belong to the user
 */
const UpdateUserComment = async (req, res) => {
  const { userId } = req.user;
  const { id: commentId } = req.params;
  const { comment } = req.body;
  const oldComment = await commentModel.findById(commentId);
  if (!oldComment) {
    throw new NotFoundError(req.t('commentDoesNotExist'));
  }
  if (oldComment.createdBy.toString() !== userId) {
    throw new UnauthorizedError(req.t('commentUpdateNotAllowed'));
  }
  await oldComment.updateOne({ comment: comment }, { runValidators: true });
  res.status(StatusCodes.OK).json({ msg: req.t('commentUpdatedSuccessfully') });
};

module.exports = { CreateComment, GetUserComments, GetAllComments, DeleteUserComment, UpdateUserComment };