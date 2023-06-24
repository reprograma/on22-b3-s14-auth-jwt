<h1 align="center"> :woman_cook: Passo-a-Passo do nosso projeto :spaghetti:</h1>

<h2 align="center">
<img src="https://media.giphy.com/media/wNDa1OZtvl6Fi/giphy.gif" width="650px"/>
<p align="center">Aquela receitinha de bolo pra vocês ficarem felizes :purple_heart:<p> 
</h2>

## Iniciando o projeto :bowl_with_spoon:

- Após forkar e clonar o projeto, no terminal entrar na pasta do projeto e usar os comandos:
```javascript
$   npm install //para buscar as depencias salvas do projeto
$   npm install jsonwebtoken // para utilizar o jwt
$   npm install bcrypt // para encriptar as senhas
```

- No arquivo .env.example vamos adicionar:
```javascript
SECRET=
```

- Crie o arquivo .env:
```javascript
DB_PORT=COLOQUE_SUA_PORTA_AQUI
DATABASE_URI=COLOQUE_SUA_URL_MONGODB_ENTRE_ASPAS_AQUI
SECRET=COLOQUE_CHAVE_SEM_ASPAS_AQUI
```
*obs:* para a SECRET deve ser gerada uma [Hash](https://passwordsgenerator.net/sha1-hash-generator/) 


- No arquivo app.js verifique se o dotenv está sendo importado:
```javascript
require("dotenv").config(); // carrega a configuração para manipular dados sensíveis
```

## Criando o nosso model de colaboradoras :floppy_disk:

- Na pasta models vamos criar um arquivo modelo de colaboradoras, iremos chamar de colaboradorasModel.js, contendo a estrutura de login (nome, email e senha)

```javascript
const mongoose = require('mongoose');

//estrutura do seu model (atributos da sua entidade)
const colaboradorasSchema = new mongoose.Schema({
    nome: { type: String },
    email: { type: String },
    senha: { type: String }
}, {
    //gera por padrão uma versão para cada atualização do documento
    versionKey: false
});

// atribuindo o esquema a uma collection
// estou definindo o nome da collection que irei salvar no banco
const colaboradoras = mongoose.model('colaboradoras', colaboradorasSchema);

// exportar o model para ser utilizado
module.exports = colaboradoras;
```
## Criando nossas rotas de colaboradoras :world_map:

- Na pasta routes vamos criar o arquivo colaboradorasRoutes.js;
- E em app.js vou pedir para utilizar as rotas:

```javascript
const colaboradorasRoutes = require('./routes/colaboradorasRoutes') //importa as rotas de colaboradoras

app.use("/gamestore", colaboradorasRoutes) //utiliza as rotas de colaboradoras
```

- Em colaboradorasRoute.js, iremos criar todas as rotas(lembre-se de comentar as rotas antes de testar):

```javascript
const express = require("express"); 
const router = express.Router();
const controller = require('../controller/colaboradorasController');

router.post('/colaboradoras/', controller.create);
router.get('/colaboradoras/', controller.getAll); 
router.delete('/colaboradoras/:id', controller.deleteById);
router.post('/colaboradoras/login', controller.login);

module.exports = router;
```

## Criando nosso código de colaboradoras :flight_departure:

- Na pasta controller crio o arquivo colaboradorasController.js com a função create:

```javascript
const Colaboradoras = require('../models/colaboradorasModel'); //chamo meu model de colaboradora
const bcrypt = require('bcrypt'); //chamo a biblioteca do bcrypt para encriptar dados

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10); //uso função do bcrypt para a senha virar um Hash
    req.body.senha = senhaComHash; //transforma a senha em Hash

    const colaboradora = new Colaboradoras(req.body); //crio uma nova colaboradora
    colaboradora.save(function (err) { //salvo a colaboradora e crio função de erro 
        if (err) {
            res.status(500).send({ message: err.message })
        }
        res.status(201).send(colaboradora.toJSON())
    })
};

module.exports = {
    create,
}

```


- Testar colaborada no Postman:

*obs:* Lembre-se de descomentar antes de testar

```
Método -> POST
EndPoint -> http://localhost:6669/colaboradoras

body -> raw -> json

No corpo:
{
    "nome": "seunome",
    "email": "seuemail@email.com",
    "senha": "suasenha"
}

para enviar clique em -> SEND
```

- Ainda no arquivo colaboradorasController.js, vamos criar função getAll:

```javascript
const getAll = (req, res) => {
    Colaboradoras.find(function (err, colaboradoras) { //usa um método para procurar as colaboradoras com um função com parametros de erro e colaboradora
        if (err) {
            res.status(500).send({ message: err.message })
        }
        res.status(200).send(colaboradoras); //retorna status de sucesso e o json com a lista das colaboradoras
    })
};

module.exports = {
    create,
    getAll,
}
```



- Testar a busca da lista de colaboradas no Postman:
```
Método -> GET
EndPoint -> http://localhost:6669/colaboradoras

para enviar clique em -> SEND
```

- Em colaboradorasController.js, vamos criar função de deletar:

```javascript
const deleteById = async (req, res) => {
    try {
        const { id } = req.params
        await Colaboradoras.findByIdAndDelete(id)
        const message = `A colaboradora com o ${id} foi deletada com sucesso!`
        res.status(200).json({ message })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
};


module.exports = {
    create,
    getAll,
    deleteById,
}
```



- Testar deletar colaborada passando o ID no Postman:
```
Método -> DELETE
EndPoint -> http://localhost:6669/colaboradoras/coloque o id

para enviar clique em -> SEND
```


- Em colaboradorasController.js, vamos criar função de login:

```javascript
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;


const login = (req, res) => {
    Colaboradoras.findOne({ email: req.body.email }, function (error, colaboradora) {
        if (!colaboradora) {
            return res.status(404).send(`Não existe colaboradora com o email ${req.body.email}`);
        }


        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha); //compara a senha do corpo com a senha do banco de dados (fazendo o Hash internamente)


        if (!senhaValida) {
        /* 403 Forbidden é um código de resposta HTTP da classe de respostas de erro do cliente, a qual indica que o servidor recebeu a requisição e foi capaz de identificar o autor, porém não autorizou a emissão de um resposta. Os motivos para a proibição do acesso podem ser especificados no corpo da resposta.
        */
            return res.status(403).send('erro ao digitar a senha');
        }
        const token = jwt.sign({ email: req.body.email }, SECRET);
        return res.status(200).send(token);
    });
}


module.exports = {
    create,
    getAll,
    deleteById,
    login
}
```



- Testar a busca da lista de colaboradas no Postman:
```
Método -> POST
EndPoint -> http://localhost:6669/colaboradoras/login

body -> raw -> json
No corpo:
{
    "nome": "seunome",
    "email": "seuemail@email.com",
    "senha": "suasenha"
}

para enviar clique em -> SEND

Ele irá retornar o TOKEN
```

## Agora vamos proteger as rotas da nossa API :closed_lock_with_key:

-  No início do arquivo consolesController.js importe: 
  
```javascript
const jwt = require('jsonwebtoken') // importa o JWT
const SECRET = process.env.SECRET // carrega a chave SECRET do meu .env
```

- Em uma das rotas em controller no arquivo consolesController.js, dentro do código em try:
  
```javascript

const authHeader = req.get('authorization'); // pega o cabeçalho de autorização


  if (!authHeader) { //trata o erro ao esquecer de passar o token 
    return res.status(401).send('Você esqueceu de passar as informações de autorização'); 
  }



  const token = authHeader.split(' ')[1]; //separa as informações do cabeçalho em um array de 2 posições



  jwt.verify(token, SECRET, function(erro) { // verifica o token passado e a SECRET  
    if (erro) {
      return res.status(403).send('Acesso não autorizado'); // função para tratar erro de autorização
    }
    
    //colocar o código da sua rota aqui
})
```

- Testar no Postman se sua rota está protegida:
```
Método -> Usar o método que foi protegido, exemplo: GET 
EndPoint -> Usar o endpoint do método que foi protegido, exemplo: http://localhost:6669/gamestore/consoles/all



Authorization -> Type: Bearer Token -> Token (colocar o TOKEN que retornou ao fazer o login em colaboradoras)



para enviar clique em -> SEND
```
