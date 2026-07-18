const router = require("express").Router();
const auth = require("../middleware/auth");
const { listInventory } = require("../controllers/inventoryController");

router.get("/", auth, listInventory);

module.exports = router;
