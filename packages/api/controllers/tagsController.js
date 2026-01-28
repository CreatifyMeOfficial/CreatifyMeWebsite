const { StatusCodes } = require('http-status-codes');
const tagModel = require('../models/tagModel');
const { NotFoundError } = require('../errors');
const Personality = require('../models/personalityModel');

/**
 * @description Retrieves all tags from the database and returns them in the response.
 * 
 * @returns {Object} 200 - An object containing an array of tags
 * @returns {Error}  500 - Internal server error
 */
const GetTags = async (req, res) => {
  const tags = await tagModel.find({});
  res.status(StatusCodes.OK).json({ tags: tags });
};

/**
 * @description Creates a new tag in the database.
 * @param {Object} req - Express request object containing the tag in the body.
 * @param {Object} res - Express response object.
 * @returns {Object} 201 - JSON response indicating success.
 * @throws {Error} If there is an error during tag creation.
 */
const CreateTag = async (req, res) => {
  const { tag } = req.body;
  await tagModel.create({ tag: tag });
  res.status(StatusCodes.CREATED).json({ msg: req.t('tagCreatedSuccessfully') });
};

/**
 * @description Deletes a tag from the database by its ID.
 *              Also removes the tag reference from all Personality documents.
 * @param {Object} req - Express request object containing the tag ID in params.
 * @param {Object} res - Express response object.
 * @returns {Object} 200 - JSON response indicating success.
 * @throws {NotFoundError} If the tag does not exist.
 */

const DeleteTag = async (req, res) => {
  const { id } = req.params;
  const tag = await tagModel.findById(id);
  // Check if the tag exists or not, if not then throw not found error
  if (!tag) {
    throw new NotFoundError(req.t('tagDoesNotExist'));
  }
  await tag.deleteOne();
  // Remove the tag from all Personality documents that reference it
  await Personality.updateMany(
    { tags: tag._id },
    { $pull: { tags: tag._id } }
  );
  res.status(StatusCodes.OK).json({ msg: req.t('tagDeletedSuccessfully') });
};

module.exports = { GetTags, CreateTag, DeleteTag };