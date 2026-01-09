const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validatePassword = require('../helperMethods/passwordValidator');
const { BadRequestError } = require('../errors/');
const userRoles = require('../enums/userRoles');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    maxLength: 30,
    minLength: 3,
    trim: true,
    unique: true,
    required: [true, 'Please provide a user name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email!'],
    unique: true,
    /**
     * Check if the given email is a valid email address
     */
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email!',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
  },
  firstName: {
    type: String,
    required: [true, 'Please enter your first name!'],
    trim: true,
    minLength: 3,
    maxLength: 25
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name!'],
    trim: true,
    minLength: 3,
    maxLength: 25
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number!'],
    /**
     * Check if the given phone number is a valid phone number
     */
    match: [/^\+[1-9]\d{7,14}$/, 'Phone number is not valid'],
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
    required: [true, 'Please provide a birth date!'],
    validate: {
      validator: function (date) {
        let now = new Date();
        let birthDate = new Date(date);
        let age = now.getFullYear() - birthDate.getFullYear();
        return age >= 15;
      },
      message: 'You must be at least 15 years old to create an account'
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
  }
});


userSchema.pre('save', async function () {
  // Check if the password hasn't changed 
  if (!this.isModified('password')) return;

  // Validate the password
  const isValid = validatePassword(this.password);
  if (!isValid) {
    throw new BadRequestError('Password must be 10-50 chars, include upper, lower, number, symbol, and no spaces.');
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

module.exports = mongoose.model('User', userSchema);