const router = require("express").Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/productController");

router.get("/", auth, ctrl.listProducts);
router.post(
  "/",
  auth,
  [
    body("name").isString().trim().notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("cost").optional().isFloat({ min: 0 }),
    body("stock").optional().isInt({ min: 0 }),
    body("sku").optional().isString(),
    body("category").optional().isString(),
  ],
  validate,
  ctrl.createProduct
);
router.put(
  "/:id",
  auth,
  [
    body("name").optional().isString(),
    body("price").optional().isFloat({ min: 0 }),
    body("cost").optional().isFloat({ min: 0 }),
    body("stock").optional().isInt({ min: 0 }),
  ],
  validate,
  ctrl.updateProduct
);
router.delete("/:id", auth, requireRole("admin"), ctrl.deleteProduct);

module.exports = router;
