const router = require('express').Router();
const { CreateComment, GetUserComments, GetAllComments, DeleteUserComment, UpdateUserComment } = require('../controllers/commentsController');
const authenticate = require('../middleware/authentication');

router.post('/user/comments', authenticate, CreateComment);
router.get('/comments', GetAllComments);
router.get('/user/comments', authenticate, GetUserComments);
router.delete('/user/comments/:id', authenticate, DeleteUserComment);
router.patch('/user/comments/:id', authenticate, UpdateUserComment);

module.exports = router;