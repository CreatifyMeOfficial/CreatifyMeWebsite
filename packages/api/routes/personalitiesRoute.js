const router = require('express').Router();
const userRoles = require('../enums/userRoles');
const authenticateUser = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const { GetPersonalities, AddTagToPersonality, RemoveTagFromPersonality } = require('../controllers/personalitiesController');

router.get('/personalities', authenticateUser, authorizeUser(userRoles.SUPER_ADMIN, userRoles.ADMIN), GetPersonalities);
router.patch('/personalities/add-tag/:id', authenticateUser, authorizeUser(userRoles.SUPER_ADMIN, userRoles.ADMIN), AddTagToPersonality);
router.patch('/personalities/remove-tag/:id', authenticateUser, authorizeUser(userRoles.SUPER_ADMIN, userRoles.ADMIN), RemoveTagFromPersonality);

module.exports = router;