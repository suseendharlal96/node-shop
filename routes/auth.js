const express = require("express");
const { check } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
  check("password")
    .isLength({ min: 8 })
    .trim()
    .withMessage("Min 8 characters"),
  authController.postLogin
);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .custom((val, { req }) => {
        return User.findOne({ email: val }).then(user => {
          if (user) {
            return Promise.reject(
              "User already exists with the email.Try another email"
            );
          }
        });
      }),
    check("password")
      .isLength({ min: 8 })
      .trim()
      .withMessage("Min 8 characters"),
    check("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not Match");
        }
        return true;
      })
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getResetPassword);
router.post("/reset", authController.postResetPassword);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
