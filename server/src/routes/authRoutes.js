const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/authController");

router.post(
  "/signup",
  [
    body("name").isString().trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 6 }),
    body("businessName").optional().isString(),
  ],
  validate,
  ctrl.signup
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isString().notEmpty()],
  validate,
  ctrl.login
);

module.exports = router;
