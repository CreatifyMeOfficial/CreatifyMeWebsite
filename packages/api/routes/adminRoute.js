const express = require("express");
const router = express.Router();
const { GetUsers, ChangeRole, DeleteUserComment } = require("../controllers/adminController");
const authenticateUser = require("../middleware/authentication");
const authorize = require("../middleware/authorization");
const isUserVerified = require("../middleware/verification");
const userRoles = require("../enums/userRoles");

// Get all users by admin only
router.get("/users", authenticateUser, isUserVerified, authorize(userRoles.ADMIN, userRoles.SUPER_ADMIN), GetUsers);
// Change role of a user by admin only
router.patch('/users/change-role/:id', authenticateUser, isUserVerified, authorize(userRoles.SUPER_ADMIN), ChangeRole);
// Delete a user's comment by admin only
router.delete('/comments/delete-comment/:id', authenticateUser, isUserVerified, authorize(userRoles.ADMIN, userRoles.SUPER_ADMIN), DeleteUserComment);

module.exports = router;
