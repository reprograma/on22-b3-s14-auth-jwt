const ColaboradorasModel = require("../models/colaboradorasModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha,10) //transforma a senha em hash, embaralhando
    req.body.senha = senhaComHash //coloca a senha embaralhada, faz a requisição dentro do corpo (pega a informaçã dentro do corpo) e dentro do corpo pega a senha, transformando a senha em hash

    const colaboradora = new ColaboradorasModel(req.body) // crio uma nova colaboradora
    colaboradora.save(function(err) { // salvo a colaboradora e crio uma função de erro
        if(err) {
            res.status(500).send({
                message: err.message
            })
        }
        res.status(201).send(colaboradora.toJSON()) // 201 é para quando algo foi cadastrado
    })
}

const getAll = (req, res) => {
    ColaboradorasModel.find(function(err, colaboradoras){
        if(err) {
            res.status(500).send({
                message: err.message
            })
        }
        res.status(200).send(colaboradoras)
    })
}

const deleteById = async (req, res) => {
    try {
        const {id} = req.params
        await ColaboradorasModel.findByIdAndDelete(id)
        const message = `A colaboradora com o id: ${id} foi deletada com sucesso!`
        res.status(200).json({
            message
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const login = (req, res) => {
    ColaboradorasModel.findOne({email: req.body.email}, function(err, colaboradoras){
        if(!colaboradoras) {
            return res.status(404).send(`Não existe colaboradora com o email ${req.body.email}!`)
        }

        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradoras.senha) // o compareSync vai comparar as informações, nesse caso comparar as senhas

        if(!senhaValida) {
            return res.status(403).send("Erro ao digitar a senha") 
        }

        const token = jwt.sign({email: req.body.email}, SECRET)
        return res.status(200).send(token)
    })
}

module.exports = {
    create,
    getAll,
    deleteById,
    login,
}