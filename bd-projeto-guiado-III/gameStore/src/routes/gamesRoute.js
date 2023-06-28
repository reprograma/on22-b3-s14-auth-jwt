const controller = require('../controller/gamesController');
const express = require('express');

const router = express.Router();

router.post("/add", controller.addNewGame);
router.get("/all", controller.findAllGames);
router.get("/:id", controller.findGameById);
router.patch("/:id", controller.updateGame);
router.delete("/:id", controller.deleteGame);

module.exports = router