const QuestionModel = require('../models/testQuestionModel');
const ResultModel = require('../models/resultModel');
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require('../errors');
const MBTIAttributes = require('../enums/MBTIAttributes');
const HollandAttributes = require('../enums/HollandAttributes');
const { GenerateStructure } = require('../helperMethods/testResultStructure');
const PersonalityModel = require('../models/personalityModel');

/**
 * @description Retrieves all the test questions from the database
 * @returns {Object} JSON response containing an array of questions
 * @throws {Error} If there's an error retrieving questions from the database
 */
const GetAllQuestions = async (req, res) => {
  const questions = await QuestionModel.find({}).select('-__v');
  res.status(StatusCodes.OK).json({ questions: questions });
};

/**
 * @description Creates a new test question in the database
 * @param {Object} req - Express request object containing question data in body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response indicating success
 * @throws {Error} If there's an error creating the question in the database
 */
const AddQuestion = async (req, res) => {
  const { questionEn, questionAr, MBTIAttribute, HollandAttribute } = req.body;
  await QuestionModel.create({ questionEn, questionAr, MBTIAttribute, HollandAttribute });
  res.status(StatusCodes.CREATED).json({ msg: req.t('questionCreatedSuccessfully') });
};

/**
 * @description Deletes a test question from the database
 * @param {Object} req - Express request object containing question ID in params
 * @param {Object} res - Express response object
 * @returns {Object} JSON response indicating success
 * @throws {NotFoundError} If the question doesn't exist
 */
const DeleteQuestion = async (req, res) => {
  const { Id } = req.params;
  const question = await QuestionModel.findByIdAndDelete(Id);
  if (!question) {
    throw new NotFoundError(req.t('questionDoesNotExist'));
  }
  res.status(StatusCodes.OK).json({ msg: req.t('questionDeletedSuccessfully') });
};


/**
 * @description Updates an existing test question in the database
 * @param {Object} req - Express request object containing question ID in params and updated data in body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response indicating success
 * @throws {NotFoundError} If the question doesn't exist
 */
const UpdateQuestion = async (req, res) => {
  const { Id } = req.params;
  const { questionEn, questionAr, MBTIAttribute, HollandAttribute } = req.body;
  const updatedQuestion = await QuestionModel.findByIdAndUpdate(Id, { questionEn, questionAr, MBTIAttribute, HollandAttribute }, { runValidators: true });
  if (!updatedQuestion) {
    throw new NotFoundError(req.t('questionDoesNotExist'));
  }
  res.status(StatusCodes.OK).json({ msg: req.t('questionUpdatedSuccessfully') });

};

/**
 * @description Calculates test results based on user's answers and saves them to the database
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object containing userId
 * @param {string} req.user.userId - ID of the user taking the test
 * @param {Object} req.body - Request body containing user's answers
 * @param {Array<Object>} req.body.answers - Array of answer objects
 * @param {string} req.body.answers[].questionId - ID of the question being answered
 * @param {number} req.body.answers[].value - Numeric value of the answer (typically 1-5)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing calculated MBTI type and Holland code
 * @throws {BadRequestError} If any question in answers doesn't exist in the database
 */
const CalculateResults = async (req, res) => {
  const { userId } = req.user;
  const { answers } = req.body;
  const questions = await QuestionModel.find({});
  const result = GenerateStructure();
  answers.forEach(answer => {
    // Loop through all saved questions from the database to find the question which match the question which the user has answered
    const question = questions.find((q) => q._id.toString() === answer.questionId);
    if (!question) {
      throw new BadRequestError(req.t('questionDoesNotExist'));
    }
    // Add the question value to the corresponding attribute from each test
    result.mbti[question.MBTIAttribute] += Number(answer.value);
    result.holland[question.HollandAttribute] += Number(answer.value);
  });

  const { mbti, holland } = result;

  // Calculate MBTI type
  const mbtiType = [
    mbti.E > mbti.I ? 'E' : 'I',
    mbti.S > mbti.N ? 'S' : 'N',
    mbti.T > mbti.F ? 'T' : 'F',
    mbti.J > mbti.P ? 'J' : 'P'
  ].join('');

  result.mbti = mbtiType;
  const hollandEntries = Object.entries(holland);
  const sortedHolland = hollandEntries
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key[0])
    .slice(0, 3)
    .sort();

  result.holland = sortedHolland.join('');

  // Get the description of the user personality 
  const description = await PersonalityModel.findOne({ code: `${result.holland}+${result.mbti}` });

  // Save the user result. if the user has a result then update it if not create a new one
  const existingResult = await ResultModel.findOne({ userId: userId });
  if (existingResult) {
    existingResult.codeId = description._id;
    await existingResult.save();
  } else {
    await ResultModel.create({ userId: userId, codeId: description._id });
  }

  res.status(StatusCodes.OK).json({ result: description });
};


/**
 * @description Gets the user personality description
 * @returns {Object} JSON response containing the user personality 
 * @throws {NotFoundError} If the user does not have a personality description saved in the database
 */
const GetUserResult = async (req, res) => {
  const { userId } = req.user;

  const result = await ResultModel.findOne({ userId: userId });
  if (!result) {
    throw new NotFoundError(req.t('userDoesNotHaveResult'));
  }

  const description = await PersonalityModel.findById(result.codeId);
  res.status(StatusCodes.OK).json({ result: description });
};


module.exports = { GetAllQuestions, AddQuestion, DeleteQuestion, UpdateQuestion, CalculateResults, GetUserResult };