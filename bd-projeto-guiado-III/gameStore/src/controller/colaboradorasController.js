const Colaboradoras = require('../models/colaboradorasModel')
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")
const colaboradoras = require('../models/colaboradorasModel')
const SECRET = process.env.SECRET


const create = (req, res) => {
    const senhaComHas = bcryptjs.hashSync(req.body.senha, 10) //transforma a senha em hash embaralhando
    req.body.senha = senhaComHas  //coloca a senha embaralhada

    const colaboradora = new Colaboradoras(req.body)
    colaboradora.save(function (error) {
        if (error) {
            res.status(500).send({ message: error.message }) // salva a nova colaboraora
        }
        res.status(201).send(colaboradora.toJson())
    })
}

const getAll = (req, res) => {
    ColaboradorasModel.find(function (error, colaboradoras) {
        if (error) {
            res.status(500).send({ 
                message: error.message })
        }
        res.status(201).send(colaboradoras)
    })

}

const deleteById = async (req, res) => {
    try {
        const { id } = req.params
        await ColaboradorasModel.findByIdAndDelete(id);
        const message = 'A colaboradora com o id: ${id} foi deletada com sucesso!'
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })

    }
}

const login = (req, res) => {
    Colaboradoras.findOne({ email: req.body.email }, function (error, colaboradoras) {
        if (!colaboradoras) {
            return res.status(404).send('Email de colaboradora ${req.body.email} não encontrado!')
        }

        const senhaValida = bcryptjs.compareSync(req.body.senha, colaboradoras.senha)
        if (!senhaValida) {
            return res.status(403).send("erro ao digitar a senha")
        }

        const token = jwt.sign({ email: req.body.email }, SECRET)
        return res.status(200).send(token)


    })
}

module.exports = {
    create, getAll, deleteById, login
}