const express = require("express"); // o express ajuda nas rotas
const router = express.Router(); //chama o router
const controller = require("../controller/colaboradorasController") //importação do controller


//chama o router, chama o método, chamada o controller(pasta) e depois o create
router.post("/colaboradoras", controller.create); 

//chama router, chama o método, chama a pasta controller e o nome 
router.get("/colaboradoras", controller.getAll);

//coloca o id pq eu quero deletar pelo id, sem id ele deleta tudo
router.delete("/colaboradoras/:id", controller.deleteById) 

//login porque tem que acrescentar email e senha
router.post("/colaboradoras/login", controller.login) 

//exportar as rotas 
module.exports = router;

//aqui criamos as rotas, ai vamos para a lógica que é no controller.
//lembra de comentar as rotas enquanto vai fazer a lógica lá no controller