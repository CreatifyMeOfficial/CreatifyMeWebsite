const router = require('express').Router();
const { GetAllQuestions, AddQuestion, DeleteQuestion, UpdateQuestion, CalculateResults, GetUserResult } = require('../controllers/questionsController');
const authenticateUser = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const userRoles = require('../enums/userRoles');

router.get('/questions', GetAllQuestions);
router.post('/questions', authenticateUser, authorizeUser(userRoles.SUPER_ADMIN, userRoles.ADMIN), AddQuestion);
router.delete('/questions/:Id', authenticateUser, authorizeUser(userRoles.SUPER_ADMIN, userRoles.ADMIN), DeleteQuestion);
router.patch('/questions/:Id', authenticateUser, authorizeUser(userRoles.SUPER_ADMIN, userRoles.ADMIN), UpdateQuestion);
router.post('/questions/calculate', authenticateUser, CalculateResults);
router.get('/questions/user-result', authenticateUser, GetUserResult);

module.exports = router;