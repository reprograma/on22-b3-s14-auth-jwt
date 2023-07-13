const express = require("express");
const router = express.Router();
const controller = require("../controller/colaboradasController");

router.get("/", controller.getAll);
router.delete("/:id", controller.deleteById);

module.exports = router;
