const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
const resultModel = require("../models/resultModel");
const { UnauthenticatedError, BadRequestError, NotFoundError, ForbiddenError } = require("../errors");
const { uploadImage, deleteImage } = require('../helperMethods/imageManager');
const fs = require('fs').promises;
const { filterWords } = require('../helperMethods/wordsFilter');
const userRoles = require('../enums/userRoles');
const { parsePhoneNumberWithError } = require('libphonenumber-js');
const { sendEmail } = require('../helperMethods/mailer');
const { GetVerificationTemplate, GetResetPasswordTemplate } = require("../helperMethods/emailTemplate");


const cookieConfig = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  domain: process.env.NODE_ENV === 'production' ? '.creatifymeweb.com' : 'localhost',
  path: '/'
};

/**
 * Registers a new user and generates a JWT token
 * @param {Request} req - Express request object containing user details in body
 * @param {Response} res - Express response object used to send back the JWT token as a http only cookie
 * @throws {BadRequestError} When required fields are missing
 * @throws {Error} When user creation fails
 */
const Register = async (req, res) => {
  const { userName, firstName, lastName, phone, countryKey, email, password, confirmPassword, birthDate } = req.body;
  if (!countryKey) {
    throw new BadRequestError(req.t('countryKeyRequired'));
  }
  if (confirmPassword !== password) {
    throw new BadRequestError(req.t('confirmPasswordDoesNotMatch'));
  }
  const fullPhoneNumber = parsePhoneNumberWithError(phone, countryKey.toUpperCase());
  if (!fullPhoneNumber.isValid()) {
    throw new BadRequestError(req.t('phoneNumberNotValid'));
  }
  await filterWords(userName, firstName, lastName, email, password);
  const lowerCaseEmail = email.toLowerCase();
  const user = await userModel.create({ userName, firstName, lastName, phone: fullPhoneNumber.number, email: lowerCaseEmail, password, birthDate });
  const token = await user.GenerateJWTToken();
  res.cookie('token', token, {
    ...cookieConfig,
    httpOnly: true,
    maxAge: process.env.COOKIE_AGE,
  });
  res.cookie('isLoggedIn', true, {
    ...cookieConfig,
    maxAge: process.env.COOKIE_AGE,
  });
  res.status(StatusCodes.CREATED).json({ msg: req.t('accountCreatedSuccessfully') });
};


/**
 * Authenticates a user by validating their email and password
 * @param {Request} req - Express request object containing email and password in body
 * @param {Response} res - Express response object used to send back the JWT token as a http only cookie
 * @throws {BadRequestError} When email or password is missing
 * @throws {UnauthenticatedError} When credentials are invalid
 */
const Login = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    throw new BadRequestError(req.t('credentialsRequired'));
  }
  const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  let user;
  if (emailOrUsername.match(regex)) {
    const lowerCaseEmail = emailOrUsername.toLowerCase();
    user = await userModel.findOne({ email: lowerCaseEmail });
  }
  else {
    user = await userModel.findOne({ userName: emailOrUsername });
  }
  if (!user) {
    throw new UnauthenticatedError(req.t('invalidCredentials'));
  }
  const isPasswordCorrect = await user.MatchPassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(req.t('invalidCredentials'));
  }
  const token = await user.GenerateJWTToken();
  res.cookie('token', token, {
    httpOnly: true,
    ...cookieConfig,
    maxAge: process.env.COOKIE_AGE,
  });
  res.cookie('isLoggedIn', true, {
    ...cookieConfig,
    maxAge: process.env.COOKIE_AGE,
  });
  res.status(StatusCodes.OK).json({ msg: req.t('loggedInSuccessfully') });
};

/**
 * Logs out a user by clearing their authentication token cookie
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object used to send back the success status
 */
const Logout = async (req, res) => {
  // Clear the HTTP-only cookie
  res.cookie('token', '', {
    httpOnly: true,
    ...cookieConfig,
    maxAge: 0,
    expires: new Date(0),
  });
  res.cookie('isLoggedIn', '', {
    ...cookieConfig,
    httpOnly: false,
    maxAge: 0,
    expires: new Date(0)
  });
  res.status(StatusCodes.OK).json({ msg: req.t('loggedOutSuccessfully') });
};

/**
 * Verifies the email of the authenticated user
 * @param {Request} req - Express request object containing the user's ID and the verification code
 * @param {Response} res - Express response object used to send back the success status
 * @throws {BadRequestError} When the verification code is invalid or has expired
 */
const VerifyEmail = async (req, res) => {
  const { userId } = req.user;
  const { verificationCode } = req.body;
  if (!verificationCode) {
    throw new BadRequestError(req.t('verificationCodeRequired'));
  }
  const user = await userModel.findById(userId);
  if (user.isVerified) {
    throw new BadRequestError(req.t('userWasVerifiedAlready'));
  }
  if (!user.verificationCodeExpireDate || !user.verificationCode) {
    throw new BadRequestError(req.t('noVerificationCodeFound'));
  }
  if (new Date(user.verificationCodeExpireDate).getTime() < Date.now()) {
    user.verificationCode = undefined;
    user.verificationCodeExpireDate = undefined;
    await user.save();
    throw new BadRequestError(req.t('verificationCodeExpired'));
  }
  if (user.verificationAttempts <= 0) {
    user.verificationCode = undefined;
    user.verificationCodeExpireDate = undefined;
    await user.save();
    throw new BadRequestError(req.t('tooManyVerificationAttempts'));
  }
  if (String(user.verificationCode) !== String(verificationCode)) {
    user.verificationAttempts -= 1;
    await user.save();
    throw new BadRequestError(req.t('invalidVerificationCode'));
  }
  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpireDate = undefined;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: req.t('accountVerifiedSuccessfully') });
};


/**
 * Resets the password of the given email
 * @param {Request} req - Express request object containing the user's email, password reset code, new password, and confirmation password
 * @param {Response} res - Express response object used to send back the success status
 * @throws {BadRequestError} When passwords do not match, the user doesn't exist, the new password is the same as the last one, reset code is invalid or expired, or attempts are exceeded
 */
const ResetPassword = async (req, res) => {
  const { email, passwordResetCode, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    throw new BadRequestError(req.t('confirmPasswordDoesNotMatch'));
  }
  if (!passwordResetCode) {
    throw new BadRequestError(req.t('passwordResetCodeRequired'));
  }
  const user = await userModel.findOne({ email: email });
  if (!user) {
    throw new BadRequestError(req.t('passwordResetFailed'));
  }
  if (!user.passwordResetCodeExpireDate || !user.passwordResetCode) {
    throw new BadRequestError(req.t('noPasswordResetCodeFound'));
  }
  if (new Date(user.passwordResetCodeExpireDate).getTime() < Date.now()) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpireDate = undefined;
    await user.save();
    throw new BadRequestError(req.t('passwordResetCodeExpired'));
  }
  if (user.passwordResetAttempts <= 0) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpireDate = undefined;
    await user.save();
    throw new BadRequestError(req.t('tooManyPasswordResetAttempts'));
  }
  if (String(user.passwordResetCode) !== String(passwordResetCode)) {
    user.passwordResetAttempts -= 1;
    await user.save();
    throw new BadRequestError(req.t('invalidPasswordResetCode'));
  }
  if (await user.MatchPassword(newPassword)) {
    throw new BadRequestError(req.t('newPasswordIsTheSameAsOld'));
  }
  user.password = newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpireDate = undefined;
  await user.save({ runValidators: true });
  res.status(StatusCodes.OK).json({ msg: req.t('passwordResetSuccessfully') });
};


/**
 * Sends a password reset code email to the user
 * @param {Request} req - Express request object containing the user's email in the request body
 * @param {Response} res - Express response object used to send back the success status
 * @throws {BadRequestError} When sending the email fail
 */
const SendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(StatusCodes.OK).json({ msg: req.t('passwordResetCodeSentSuccessfully') });
  }
  const passwordResetCode = user.GeneratePasswordResetCode();
  await user.save();
  try {
    await sendEmail(user.email, "Password reset code for Creatify Me Account", GetResetPasswordTemplate(passwordResetCode));
  }
  catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpireDate = undefined;
    await user.save();
    throw new BadRequestError(req.t('passwordResetCodeSendFailed'));
  }
  res.status(StatusCodes.OK).json({ msg: req.t('passwordResetCodeSentSuccessfully') });
};

/**
 * Sends the email verification code to the authenticated user
 * @param {Request} req - Express request object containing the user's ID
 * @param {Response} res - Express response object used to send back the success status
 */
const SendVerificationEmail = async (req, res) => {
  const { userId } = req.user;
  const user = await userModel.findById(userId);
  if (user.isVerified) {
    throw new BadRequestError(req.t('userWasVerifiedAlready'));
  }
  const verificationCode = user.GenerateVerificationCode();
  await user.save();
  try {
    await sendEmail(user.email, 'Verification Code For Creatify Me Account', GetVerificationTemplate(verificationCode));
  } catch (error) {
    user.verificationCode = undefined;
    user.verificationCodeExpireDate = undefined;
    await user.save();
    throw new BadRequestError(req.t('emailVerificationSendFailed'));
  }
  res.status(StatusCodes.OK).json({ msg: req.t('emailVerificationSentSuccessfully') });
};


/**
 * Adds a user profile image to their account
 * @param {Request} req - Express request object containing the uploaded image file
 * @param {Response} res - Express response object used to send back the success status
 * @throws {BadRequestError} When no file is uploaded
 */
const AddUserImage = async (req, res) => {
  if (!req.file) {
    // Delete the temporary image from the server
    await fs.unlink(req.file.path);
    throw new BadRequestError(req.t('imageRequired'));
  }
  if (!req.file.mimetype.startsWith('image/')) {
    // Delete the temporary image from the server
    await fs.unlink(req.file.path);
    throw new BadRequestError(req.t('imageFileIncorrect'));
  }
  // Upload the user profile image to cloudinary website 
  const imageUrl = await uploadImage(req.file.path, req.user.userId);
  // Save the image url to the data base
  await userModel.findByIdAndUpdate(req.user.userId, { image: imageUrl });
  // Delete the temporary image from the server
  await fs.unlink(req.file.path);

  res.status(StatusCodes.OK).json({ msg: "userImageUpdatedSuccessfully" });
};

/**
 * Retrieves user details including the user's profile image
 * @param {Request} req - Express request object containing the user's ID
 * @param {Response} res - Express response object used to send back the user details
 * @throws {Error} When user retrieval fails
 */
const GetUser = async (req, res) => {
  const user = await userModel.findById(req.user.userId).select(['-password', '-__v', '-verificationCode', '-verificationCodeExpireDate', '-verificationAttempts']);
  res.status(StatusCodes.OK).json({ user: user });
};

/**
 * Updates user details including the user's profile image
 * @param {Request} req - Express request object containing the user's ID
 * @param {Response} res - Express response object used to send back the user details
 * @throws {Error} When user update fails
 */
const UpdateUser = async (req, res) => {
  const { firstName, lastName, countryKey, phone, birthDate } = req.body;
  if (!countryKey) {
    throw new BadRequestError(req.t('countryKeyRequired'));
  }
  await filterWords(firstName, lastName, phone);
  const fullPhoneNumber = parsePhoneNumberWithError(phone, countryKey.toUpperCase());
  if (!fullPhoneNumber.isValid()) {
    throw new BadRequestError(req.t('phoneNumberNotValid'));
  }
  await userModel.findByIdAndUpdate(req.user.userId, { firstName, lastName, phone: fullPhoneNumber.number, birthDate }, { new: true, runValidators: true });
  res.status(StatusCodes.OK).json({ msg: req.t('userInfoUpdatedSuccessfully') });
};

/**
 * Changes the password of the authenticated user
 * @param {Request} req - Express request object containing the user's ID
 * @param {Response} res - Express response object used to send back the user details
 * @throws {Error} When user update fails
 */
const ChangePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (oldPassword === newPassword) {
    throw new BadRequestError(req.t('newPasswordIsTheSameAsOld'));
  }
  if (newPassword !== confirmPassword) {
    throw new BadRequestError(req.t('confirmPasswordDoesNotMatch'));
  }
  const user = await userModel.findById(req.user.userId);
  const isPasswordCorrect = await user.MatchPassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(req.t('invalidCredentials'));
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: req.t('yourPasswordWasChangedSuccessfully') });
};


/**
 * Deletes the authenticated user's account and all associated resources
 * @param {Request} req - Express request object containing the user's ID
 * @param {Response} res - Express response object used to send back the success status
 * @throws {NotFoundError} When user is not found
 */
const DeleteMyAccount = async (req, res) => {
  const { userId } = req.user;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await userModel.findByIdAndDelete({ _id: userId }, { session: session });
    if (user.role === userRoles.SUPER_ADMIN) {
      throw new ForbiddenError(req.t('superAdminCanNotBeDeleted'));
    }
    if (!user) {
      throw new NotFoundError(req.t('userDoesNotExist'));
    }
    // Delete user resources 
    await commentModel.deleteMany({ createdBy: userId }, { session: session });
    await resultModel.deleteOne({ userId: userId }, { session: session });
    // Delete the user's profile image from cloudinary
    await deleteImage(userId);
    // Clear the HTTP-only cookie
    res.cookie('token', '', {
      httpOnly: true,
      ...cookieConfig,
      maxAge: 0,
      expires: new Date(0),
    });
    res.cookie('isLoggedIn', '', {
      ...cookieConfig,
      httpOnly: false,
      maxAge: 0,
      expires: new Date(0)
    });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  res.status(StatusCodes.OK).json({ msg: req.t('yourAccountWasDeletedSuccessfully') });
};

/**
 * Toggles the receiveEmails preference for the authenticated user
 * @param {Request} req - Express request object containing the user's ID and the receiveEmails flag in the body
 * @param {Response} res - Express response object used to send back the success status
 * @throws {NotFoundError} When the user is not found
 */
const ToggleReceiveEmails = async (req, res) => {
  const { userId } = req.user;
  const { receiveEmails } = req.body;
  const user = await userModel.findById(userId);
  user.receiveEmails = receiveEmails;
  await user.save({ runValidators: true });
  const msg = receiveEmails ? req.t('userWillReceiveEmails') : req.t('userWillNotReceiveEmails');
  res.status(StatusCodes.OK).json({ msg: msg });
};



module.exports =
{
  Register, Login, Logout,
  VerifyEmail, SendVerificationEmail,
  ResetPassword, SendPasswordResetEmail,
  AddUserImage, GetUser, UpdateUser, DeleteMyAccount,
  ChangePassword, ToggleReceiveEmails
};