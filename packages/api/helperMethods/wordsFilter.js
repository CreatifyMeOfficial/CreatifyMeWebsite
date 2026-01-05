const Filter = require('bad-words');
const filter = new Filter();
const { BadRequestError } = require('../errors');

/**
 * Filters multiple strings for inappropriate content using bad-words library
 * @param {...string} words - Variable number of strings to check
 * @throws {BadRequestError} When inappropriate content is detected
 */
const filterWords = async (...words) => {
  
  for (const word of words) {
    if (word && filter.isProfane(word)) {
      throw new BadRequestError('Inappropriate content detected');
    }
  }
};

module.exports = { filterWords };
