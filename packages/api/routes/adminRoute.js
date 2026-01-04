const express = require("express");
const router = express.Router();
const { GetUsers, ChangeRole, DeleteUserComment } = require("../controllers/adminController");
const authenticateUser = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

// Get all users by admin only
router.get("/users", authenticateUser, authorize('admin', 'super_admin'), GetUsers);
// Change role of a user by admin only
router.patch('/users/change-role/:id', authenticateUser, authorize('super_admin'), ChangeRole);
// Delete a user's comment by admin only
router.delete('/comments/delete-comment/:id', authenticateUser, authorize('admin', 'super_admin'), DeleteUserComment);

module.exports = router;
