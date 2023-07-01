const colaboradorasModel = require("../models/colaboradorasModel");
const Colaboradoras = require("../models/colaboradorasModel"); //chamando um objeto do banco de dados
const bcrypt = require("bcrypt"); //encripta senha em hash

const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10)
    req.body.senha = senhaComHash

    const colaboradora = new Colaboradoras(req.body) 
    colaboradora.save(function(err) {
        if (err) {
            res.status(500).send({
                message: err.message
            })
        }
        res.status(201).send(colaboradora.toJSON())
    });
};

const getAll = (req, res) => {
    colaboradorasModel.find(function(err, colaboradoras) {
        if (err) {
            res.status(500).send({
                message: err.message
            })
        }
        res.status(200).send(colaboradoras)
    })
};

const deleteById = async (req, res) => {
    try {
        const {id} = req.params
        await Colaboradoras.findByIdAndDelete(id)
        const message = `A colaboradora com o Id ${ìd}, foi deletada com sucesso`
        res.status(200).json({
            message
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
};

const login = (req, res) => {
    Colaboradoras.findOne({email: req.body.email}, function(err, colaboradora){
        if (!colaboradora) {
            return res.status(404).send(`Não existe colaboradora com o email ${req.body.email}`)
        }

        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha)

        if (!senhaValida) {
            return res.status(403).send("Erro ao digitar a senha")
        }

        const token = jwt.sign({email: req.body.email}, SECRET)
        return res.status(200).send(token)
    })
};

module.exports = {
    create,
    getAll,
    deleteById,
    login,
}
