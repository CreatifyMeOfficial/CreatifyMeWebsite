const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validatePassword = require('../helperMethods/passwordValidator');
const { BadRequestError, InvalidPasswordError } = require('../errors/');
const userRoles = require('../enums/userRoles');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    maxLength: [30, 'userNameLong'],
    minLength: [3, 'userNameShort'],
    trim: true,
    unique: true,
    required: [true, 'userNameRequired']
  },
  email: {
    type: String,
    required: [true, 'emailRequired'],
    unique: true,
    /**
     * Check if the given email is a valid email address
     */
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'emailInvalid',
    ],
  },
  password: {
    type: String,
    required: [true, 'passwordRequired'],
  },
  firstName: {
    type: String,
    required: [true, 'firstNameRequired'],
    trim: true,
    minLength: [3, 'firstNameShort'],
    maxLength: [25, 'firstNameLong']
  },
  lastName: {
    type: String,
    required: [true, 'lastNameRequired'],
    trim: true,
    minLength: [3, 'lastNameShort'],
    maxLength: [25, 'lastNameLong']
  },
  phone: {
    type: String,
    required: [true, 'phoneRequired'],
    /**
     * Check if the given phone number is a valid phone number
     */
    match: [/^\+[1-9]\d{7,14}$/, 'phoneInvalid'],
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dho2irge7/image/upload/v1747226204/profilePlaceHolder_isufrp.svg'
  },
  role: {
    type: String,
    enum: userRoles,
    default: userRoles.USER
  },
  birthDate: {
    type: Date,
    required: [true, 'birthDateRequired'],
    validate: {
      validator: function (date) {
        let now = new Date();
        let birthDate = new Date(date);
        let age = now.getFullYear() - birthDate.getFullYear();
        return age >= 15;
      },
      message: 'birthDateInvalid'
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  verificationCodeExpireDate: {
    type: Date,
  },
  verificationAttempts: {
    type: Number,
    default: 5,
  },
  passwordResetCode: {
    type: String,
  },
  passwordResetCodeExpireDate: {
    type: Date,
  },
  passwordResetAttempts: {
    type: Number,
    default: 5,
  },
  receiveEmails: {
    type: Boolean,
    default: false,
  },
});


userSchema.pre('save', async function () {
  // Check if the password hasn't changed 
  if (!this.isModified('password')) return;

  // Validate the password
  const isValid = validatePassword(this.password);
  if (!isValid) {
    throw new InvalidPasswordError('passwordInvalid');
  }

  // If the password has changed then hash the new value
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


/**
 * This method compares the given password with the saved password for this user.
 * @param {String} pass  The password to compare with the saved password.
 * @returns If the passed password matches the saved password (Boolean).
 */
userSchema.methods.MatchPassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};


/**
 * This method Generates a jwt token for this user.
 * @returns The generate json web token for this user.
 */
userSchema.methods.GenerateJWTToken = async function () {
  return await jwt.sign({
    userId: this._id,
    userName: this.userName
  },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

userSchema.methods.GenerateVerificationCode = function () {
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  this.verificationCode = verificationCode;
  this.verificationCodeExpireDate = Date.now() + 600000;
  this.verificationAttempts = 5;
  return verificationCode;
};

userSchema.methods.GeneratePasswordResetCode = function () {
  const passwordResetCode = crypto.randomInt(100000, 999999).toString();
  this.passwordResetCode = passwordResetCode;
  this.passwordResetCodeExpireDate = Date.now() + 600000;
  this.passwordResetAttempts = 5;
  return passwordResetCode;
};

module.exports = mongoose.model('User', userSchema);