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

const getAll = (req, res) => {
    Colaboradoras.find(function (err, colaboradoras) { //usa um método para procurar as colaboradoras com um função com parametros de erro e colaboradora
        if (err) {
            res.status(500).send({ message: err.message })
        }
        res.status(200).send(colaboradoras); //retorna status de sucesso e o json com a lista das colaboradoras
    })
};

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
