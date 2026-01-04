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
    throw new BadRequestError('Please select your country phone code!');
  }
  if (confirmPassword !== password) {
    throw new BadRequestError('The confirm password does not match your password!');
  }
  const fullPhoneNumber = parsePhoneNumberWithError(phone, countryKey.toUpperCase());
  if (!fullPhoneNumber.isValid()) {
    throw new BadRequestError('Please provide a valid phone number!');
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
  res.status(StatusCodes.CREATED).json({ status: 'Success' });
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
    throw new BadRequestError('Please provide an email or user name and a password!');
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
    throw new UnauthenticatedError('Invalid credentials!');
  }
  const isPasswordCorrect = await user.MatchPassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials!');
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
  res.status(StatusCodes.OK).json({ status: 'Success' });
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
  res.status(StatusCodes.OK).json({ status: 'Success' });
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
    throw new BadRequestError('No file uploaded');
  }
  if (!req.file.mimetype.startsWith('image/')) {
    // Delete the temporary image from the server
    await fs.unlink(req.file.path);
    throw new BadRequestError('File type is incorrect. Please upload a valid image file (e.g., jpg, png, gif).');
  }
  // Upload the user profile image to cloudinary website 
  const imageUrl = await uploadImage(req.file.path, req.user.userId);
  // Save the image url to the data base
  await userModel.findByIdAndUpdate(req.user.userId, { image: imageUrl });
  // Delete the temporary image from the server
  await fs.unlink(req.file.path);

  res.status(StatusCodes.OK).json({ status: 'Success' });
};

/**
 * Retrieves user details including the user's profile image
 * @param {Request} req - Express request object containing the user's ID
 * @param {Response} res - Express response object used to send back the user details
 * @throws {Error} When user retrieval fails
 */
const GetUser = async (req, res) => {
  const user = await userModel.findById(req.user.userId).select(['-password', '-__v']);
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
    throw new BadRequestError('Please select your country phone code!');
  }
  await filterWords(firstName, lastName, phone);
  const fullPhoneNumber = parsePhoneNumberWithError(phone, countryKey.toUpperCase());
  if (!fullPhoneNumber.isValid()) {
    throw new BadRequestError('Please provide a valid phone number!');
  }
  await userModel.findByIdAndUpdate(req.user.userId, { firstName, lastName, phone: fullPhoneNumber.number, birthDate }, { new: true, runValidators: true });
  res.status(StatusCodes.OK).json({ status: 'Success' });
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
    throw new BadRequestError('New password cannot be the same as the old password!');
  }
  if (newPassword !== confirmPassword) {
    throw new BadRequestError('The confirm password does not match your password!');
  }
  const user = await userModel.findById(req.user.userId);
  const isPasswordCorrect = await user.MatchPassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials!');
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ status: 'Success' });
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
      throw new ForbiddenError('Super admin cannot be deleted');
    }
    if (!user) {
      throw new NotFoundError('User not found');
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
  res.status(StatusCodes.OK).json({ status: 'Success' });
};



module.exports = { Register, Login, Logout, AddUserImage, GetUser, UpdateUser, DeleteMyAccount, ChangePassword };