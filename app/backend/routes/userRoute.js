const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const upload = require("../middleware/upload");
router.post(
  "/register",
  upload.single("profilePicture"),
  controller.userRegister
);

router.get("/", controller.getUsers);

router.get("/stats", controller.getUserStats);
// Get specific user by id
router.get("/:id", controller.getUserById);

// Delete user by id
router.delete("/:id", controller.deleteUserById);


module.exports = router;
