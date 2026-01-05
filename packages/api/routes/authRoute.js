const router = require('express').Router();
const { Login, Register, Logout, AddUserImage, GetUser, UpdateUser, DeleteMyAccount, ChangePassword } = require('../controllers/authController');
const authenticate = require('../middleware/authentication');
const upload = require('multer')({ dest: 'uploads/' });


router.post('/user/signup', Register);
router.post('/user/login', Login);
router.post('/user/logout', Logout);
router.post('/user/upload-image', authenticate, upload.single('file'), AddUserImage);
router.get('/user/get-user', authenticate, GetUser);
router.patch('/user/update-user', authenticate, UpdateUser);
router.delete('/user/delete-user', authenticate, DeleteMyAccount);
router.patch('/user/change-password', authenticate, ChangePassword);

module.exports = router;