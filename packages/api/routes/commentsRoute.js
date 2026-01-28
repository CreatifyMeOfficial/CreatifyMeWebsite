const router = require('express').Router();
const { CreateComment, GetUserComments, GetAllComments, DeleteUserComment, UpdateUserComment } = require('../controllers/commentsController');
const authenticate = require('../middleware/authentication');
const isUserVerified = require('../middleware/verification');

router.post('/user/comments', authenticate, isUserVerified, CreateComment);
router.get('/comments', GetAllComments);
router.get('/user/comments', authenticate, GetUserComments);
router.delete('/user/comments/:id', authenticate, isUserVerified, DeleteUserComment);
router.patch('/user/comments/:id', authenticate, isUserVerified, UpdateUserComment);

module.exports = router;