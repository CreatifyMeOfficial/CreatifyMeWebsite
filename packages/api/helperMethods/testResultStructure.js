
const MBTIAttributes = require('../enums/MBTIAttributes');
const HollandAttributes = require('../enums/HollandAttributes');

/**
 * Generate the structure of the test result
 * @returns the test result structure
 */
module.exports.GenerateStructure = () => {
  return {
    mbti: Object.fromEntries(
      Object.values(MBTIAttributes).map(attr => [attr, 0])
    ),
    holland: Object.fromEntries(
      Object.values(HollandAttributes).map(attr => [attr, 0])
    ),
  };
};