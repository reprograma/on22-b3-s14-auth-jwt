const controller = require('../controller/colaboradorasController')
const express = require('express')

const router = express.Router()

router.post('/colaboradoras/login', controller.login)
router.post('/colaboradoras', controller.create)
router.get('/colaboradoras', controller.getAll)
router.delete('/colaboradoras/:id', controller.deleteById)

module.exports = router