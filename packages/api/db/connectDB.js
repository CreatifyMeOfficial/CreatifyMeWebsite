const mongoose = require('mongoose');

/**
 * Start the connection to the mongo data base
 * @param {string} mongoUri The MongoDB connection string U.RI
 */
const connectDB = async (mongoUri) => {
  await mongoose.connect(mongoUri);
};

module.exports = connectDB;