const router = require('express').Router();
const { Login, Register, Logout, VerifyEmail, SendVerificationEmail, ResetPassword, SendPasswordResetEmail,
  AddUserImage, GetUser, UpdateUser, DeleteMyAccount, ChangePassword, ToggleReceiveEmails }
  = require('../controllers/authController');
const authenticate = require('../middleware/authentication');
const rateLimit = require('express-rate-limit');
const isUserVerified = require("../middleware/verification");
const upload = require('multer')({ dest: 'uploads/' });
const { RateLimitError } = require('../errors');


router.post('/user/signup', Register);
router.post('/user/login', Login);
router.post('/user/logout', Logout);
router.post('/user/verify-email', authenticate, VerifyEmail);
router.post('/user/send-verification-email', rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // Limit each IP to 1 requests per windowMs
  handler: (req, res, next) => {
    next(new RateLimitError(req.t('rateLimitStrict')));
  }
}), authenticate, SendVerificationEmail);
router.post('/user/reset-password', ResetPassword);
router.post('/user/send-reset-password-email', rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // Limit each IP to 1 requests per windowMs
  handler: (req, res, next) => {
    next(new RateLimitError(req.t('rateLimitStrict')));
  }
}), SendPasswordResetEmail);
router.post('/user/upload-image', authenticate, isUserVerified, upload.single('file'), AddUserImage);
router.get('/user/get-user', authenticate, GetUser);
router.patch('/user/update-user', authenticate, isUserVerified, UpdateUser);
router.delete('/user/delete-user', authenticate, DeleteMyAccount);
router.patch('/user/change-password', authenticate, ChangePassword);
router.patch('/user/toggle-receive-emails', authenticate, isUserVerified, ToggleReceiveEmails);

module.exports = router;