const Colaboradoras = require('../models/colaboradorasModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const create = async (req, res) => {
    try {
        const senhaComHash = bcrypt.hashSync(req.body.senha, 10)
        //transforma a senha em hash, embaralhando
        req.body.senha = senhaComHash

        const colaboradora = new Colaboradoras(req.body)
        await Colaboradoras.create(colaboradora)

        res.status(201).json(colaboradora)
    } catch (error) {
        if (error.message.includes("dup key")) {
            res.status(500).send("Email já cadastrado")
        } else {
            res.status(500).send(error.message)
        }
    }
}

const getAll = async (req, res) => {
    try {
        const colabs = await Colaboradoras.find({})
        res.status(200).send(colabs)
    } catch (error) {
        res.status(500).send("Houve um erro na requisição")
    }
}

const deleteById = async (req, res) => {
    try {
        const { id } = req.params
        await Colaboradoras.findByIdAndDelete(id)
        const message = `A colaboradora com o id: ${id} foi deletada.`
        res.status(200).json({ message })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const login = async (req, res) => {
    try {
        const colab = await Colaboradoras.findOne({ email: req.body.email })
        if (!colab) {
            return res.status(404).send(`não existe colaboradora com o email ${req.body.email}.`)
        }
        
        const senhaValida = bcrypt.compareSync(req.body.senha, colab.senha)
        if (!senhaValida) {
            return res.status(403).send("Senha inválida.")
        }

        const token = jwt.sign({ email: req.body.email }, SECRET)
        return res.status(200).send(token)
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    create,
    getAll,
    deleteById,
    login
}