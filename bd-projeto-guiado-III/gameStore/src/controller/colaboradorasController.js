const ColaboradorasModel = require("../models/colaboradorasModels"); //chamo meu model de colaboradora
const bcrypt = require("bcrypt"); //serve pra encriptar nossa senha
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10) // o 10 é um metodo da funçao hashsync
    
    req.body.senha = senhaComHash; //transforma a senha em hash, embaralhando
    //coloca a senha embaralhada
    const colaboradora = new ColaboradorasModel(req.body); //criar uma nova colaboradora
    colaboradora.save(function (err) { //salvo a colaboradora e crio função de erro
        if (err) {
            res.status(500).send({message: err.message}) //erro de servidor e msg de erro
        } 
        res.status(201).send(colaboradora.toJSON()) //201 é cadastrado
    })
}

const getAll = (req, res) => {
    ColaboradorasModel.find(function(err, colaboradoras){ //busca tudo que tem no colaborad. model
        // primeiro parametro de rro e segundo parametro de encontrar
        if(err) {
            res.status(500).send({
                message: err.message})
        }
        res.status(200).send(colaboradoras); // retorna status de sucesso e o json com a lista das colaboradoras.
    }) 
}

const deleteById = async (req,res) => {
    try {
        const {id} =  req.params
        await ColaboradorasModel.findByIdAndDelete(id) 
        const message = `A colaboradora com o ${id} foi deletada com sucesso!`
        res.status(200).json({message})
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const login = (req, res) => {
    ColaboradorasModel.findOne({email: req.body.email}, function (error, colaboradora){
        if(!colaboradora){
            return res.status(404).send(`Não existe colaboradora com o email ${req.body.email}!`);
        }

        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha);

        if(!senhaValida){
            return res.status(403).send("erro ao digitar a senha");
        }

        const token = jwt.sign({email: req.body.email}, SECRET);
        return res.status(200).send(token)
    })
}

module.exports = {
    create,
    getAll,
    deleteById,
    login,
}