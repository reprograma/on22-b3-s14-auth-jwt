const express = require('express');
const { findAllConsoles, findConsoleById, addNewConsole, updateConsole, deleteConsole, findAvailable, findByDev } = require('../controllers/consolesController');
const router = express.Router();

router.get('/all', findAllConsoles); //ok

router.get('/available', findAvailable); //ok

router.get('/devs', findByDev); //ok

router.route('/console/:id')
    .get(findConsoleById) //ok
    .patch(updateConsole) //ok
    .delete(deleteConsole) //ok

router.post('/new', addNewConsole); //ok


module.exports = router;