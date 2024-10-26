const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/check-auth").get(authController.checkAuth);
router.route("/logout").post(authController.logout);
router.route("/delete-account").delete(authController.deleteAccount);

module.exports = router;
