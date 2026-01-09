const router = require('express').Router();
const { CreateTag, GetTags, DeleteTag } = require('../controllers/tagsController');
const authenticateUser = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');
const isUserVerified = require("../middleware/verification");
const userRoles = require('../enums/userRoles');

router.get('/tags', authenticateUser, isUserVerified, authorizeUser(userRoles.ADMIN, userRoles.SUPER_ADMIN), GetTags);
router.post('/tags', authenticateUser, isUserVerified, authorizeUser(userRoles.ADMIN, userRoles.SUPER_ADMIN), CreateTag);
router.delete('/tags/:id', authenticateUser, isUserVerified, authorizeUser(userRoles.ADMIN, userRoles.SUPER_ADMIN), DeleteTag);

module.exports = router;