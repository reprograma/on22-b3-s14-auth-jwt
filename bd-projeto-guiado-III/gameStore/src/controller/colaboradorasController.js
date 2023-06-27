const Colaboradoras = require("../models/colaboradorasModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10); //transforma a senha em hash
    req.body.senha = senhaComHash; // coloca senha embaralhada

    const colaboradora = new Colaboradoras(req.body)
    colaboradora.save(function (err) {
        if (err) {
            res.status(500).send({
                message: err.message
            })
        }
        res.status(201).send(colaboradora.toJSON()); //devolve um objetão
    })
}

const getAll = (req, res) => {
    Colaboradoras.find(function (err, colaboradoras) {
        if (err) {
            res.status(500).send({
                message: err.message
            })
        }
        res.status(200).send(colaboradoras)
    })
}

const deleteById = async (req, res) => {
    try {
        const {
            id
        } = req.params
        await Colaboradoras.findByIdAndDelete(id)
        const message = `A colaboradora com o id ${id} foi removida com sucesso`
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

const login = (req, res) => { //aqui usa o jwt e a secret
    Colaboradoras.findOne({
        email: req.body.email
    }, function (err, colaboradoras) {
        if (!colaboradoras) {
            return res.status(404).send(`Não existe colaboradora como email ${req.body.email}`)
        }

        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradoras.senha)

        if(!senhaValida){
            return res.status(403).send("Erro ao digitar a senha!")
        }
        const token = jwt.sign({email: req.body.email}, SECRET)
        return res.status(200).send(token)

    })
}
module.exports = {
    create,
    getAll,
    deleteById,
    login
}