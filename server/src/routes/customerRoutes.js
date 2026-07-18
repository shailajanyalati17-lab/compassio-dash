const router = require("express").Router();
const auth = require("../middleware/auth");
const { listCustomers } = require("../controllers/customerController");

router.get("/", auth, listCustomers);

module.exports = router;
