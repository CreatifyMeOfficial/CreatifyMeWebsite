const passwordValidator = require('password-validator');

const validatePassword = (password) => {
  const passwordSchema = new passwordValidator();

  passwordSchema.is().min(10).max(50).has().uppercase().has().lowercase().has().digits().has().symbols().has().not().spaces();

  return passwordSchema.validate(password);
};

module.exports = validatePassword;