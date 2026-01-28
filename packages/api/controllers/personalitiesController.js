const { NotFoundError, BadRequestError } = require('../errors');
const Personality = require('../models/personalityModel');
const statusCodes = require('http-status-codes');

/**
 * @description Retrieves all personalities with pagination and language support
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.page - Page number for pagination (default: 1)
 * @param {number} req.query.limit - Number of items per page (default: 10)
 * @param {string} req.query.language - Language preference: "en" for English or "ar" for Arabic (default: "en")
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing formatted personalities array and total count
 */
const GetPersonalities = async (req, res) => {
  const { page = 1, limit = 10, language = "en", code } = req.query;
  let filter = {};
  if (code) {
    const escapedCode = code.replace(/\+/g, '\\+');
    filter.code = { $regex: escapedCode, $options: 'i' };
  }
  const personalitiesTotal = await Personality.countDocuments(filter);
  let formattedPersonalities;
  const excludedField = (language === "ar") ? "-englishDescription" : "-arabicDescription";
  const includedField = (language === "ar") ? "arabicDescription" : "englishDescription";
  const personalities = await Personality.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .select(excludedField) // Exclude the other language filed
    .populate({
      path: 'tags',
      select: 'tag _id'
    })
    .lean(); // Converts to plain JS objects for easy manipulation

  // 2. Map the results to rename the field
  formattedPersonalities = personalities.map(p => {
    return {
      ...p,
      description: p[includedField],
      arabicDescription: undefined,
      englishDescription: undefined
    };
  });
  res.status(statusCodes.OK).json({ personalities: formattedPersonalities, personalitiesTotal: personalitiesTotal });
};

/**
 * @description Adds a tag to a specific personality
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - ID of the personality to add the tag to
 * @param {Object} req.body - Request body containing the tag ID
 * @param {string} req.body.tagId - ID of the tag to add to the personality
 * @param {Object} res - Express response object
 * @returns {Object} JSON response indicating success
 * @returns {Object} 400 - If the personality already has this tag
 * @throws {NotFoundError} If the personality doesn't exist
 */
const AddTagToPersonality = async (req, res) => {
  const { id: personalityId } = req.params;
  const { tagId } = req.body;
  const personality = await Personality.findById(personalityId);
  if (!personality) {
    throw new NotFoundError(req.t('personalityDoesNotExist'));
  }

  if (personality.tags.includes(tagId)) {
    throw new BadRequestError(req.t('personalityHasTag'));
  }

  personality.tags.push(tagId);
  await personality.save();

  res.status(statusCodes.OK).json({ msg: req.t('tagAddedToPersonality') });
};

/**
 * @description Removes a tag from a specific personality
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - ID of the personality to remove the tag from
 * @param {Object} req.body - Request body containing the tag ID
 * @param {string} req.body.tagId - ID of the tag to remove from the personality
 * @param {Object} res - Express response object
 * @returns {Object} JSON response indicating success
 * @returns {Object} 404 - If the personality doesn't have this tag
 * @throws {NotFoundError} If the personality doesn't exist
 */
const RemoveTagFromPersonality = async (req, res) => {
  const { id: personalityId } = req.params;
  const { tagId } = req.body;
  const personality = await Personality.findById(personalityId);
  if (!personality) {
    throw new NotFoundError(req.t('personalityDoesNotExist'));
  }
  if (!personality.tags.includes(tagId)) {
    throw new NotFoundError(req.t('personalityDoesNotHaveTag'));
  }

  personality.tags.splice(personality.tags.indexOf(tagId), 1);
  await personality.save();

  res.status(statusCodes.OK).json({ msg: req.t('tagRemovedFromPersonality') });
};

module.exports = { GetPersonalities, AddTagToPersonality, RemoveTagFromPersonality };