const express = require('express');
const { findGameById, addNewGame, updateGame, deleteGame, findAllGames } = require('../controllers/gamesController');
const router = express.Router();

router.get('/all', findAllGames); //ok

router.route('/game/:id')
    .get(findGameById) //ok
    .patch(updateGame) //ok
    .delete(deleteGame) //ok

router.post('/new', addNewGame); //ok


module.exports = router;