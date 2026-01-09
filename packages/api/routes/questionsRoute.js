const router = require('express').Router();
const { GetAllQuestions, AddQuestion, DeleteQuestion, UpdateQuestion, CalculateResults, GetUserResult } = require('../controllers/questionsController');
const authenticateUser = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const isUserVerified = require('../middleware/verification');
const userRoles = require('../enums/userRoles');

router.get('/questions', GetAllQuestions);
router.post('/questions', authenticateUser, isUserVerified, authorizeUser(userRoles.SUPER_ADMIN, userRoles.ADMIN), AddQuestion);
router.delete('/questions/:Id', authenticateUser, isUserVerified, authorizeUser(userRoles.SUPER_ADMIN, userRoles.ADMIN), DeleteQuestion);
router.patch('/questions/:Id', authenticateUser, isUserVerified, authorizeUser(userRoles.SUPER_ADMIN, userRoles.ADMIN), UpdateQuestion);
router.post('/questions/calculate', authenticateUser, isUserVerified, CalculateResults);
router.get('/questions/user-result', authenticateUser, isUserVerified, GetUserResult);

module.exports = router;