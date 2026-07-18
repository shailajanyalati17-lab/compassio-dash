const router = require("express").Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/orderController");

router.get("/", auth, ctrl.listOrders);
router.post(
  "/",
  auth,
  [
    body("total").isFloat({ min: 0 }),
    body("items").isArray({ min: 1 }),
    body("items.*.productId").isMongoId(),
    body("items.*.qty").isInt({ min: 1 }),
    body("items.*.price").isFloat({ min: 0 }),
    body("customerId").optional().isMongoId(),
    body("status").optional().isIn(["pending", "paid", "shipped", "refunded", "cancelled"]),
  ],
  validate,
  ctrl.createOrder
);
router.put(
  "/:id",
  auth,
  [body("status").optional().isIn(["pending", "paid", "shipped", "refunded", "cancelled"])],
  validate,
  ctrl.updateOrder
);

module.exports = router;
