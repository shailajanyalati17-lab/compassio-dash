const router = require("express").Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/salesController");

router.get("/", auth, ctrl.listSales);
router.post(
  "/",
  auth,
  [body("amount").isFloat({ min: 0 }), body("orderId").optional().isMongoId(), body("date").optional().isISO8601()],
  validate,
  ctrl.createSale
);

module.exports = router;
