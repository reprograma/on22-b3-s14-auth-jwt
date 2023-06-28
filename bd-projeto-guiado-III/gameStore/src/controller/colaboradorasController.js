const Colaboradoras = require('../models/colaboradorasModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const create = (request, response) => {
    const senhaComHash = bcrypt.hashSync(request.body.senha, 10)
    request.body.senha = senhaComHash

    const colaboradora = new Colaboradoras(request.body)
    colaboradora.save(function(err) {
        if (err) {
            response.status(500).send({
                message: err.message
            })
        }
        response.status(201).json(colaboradoras.toJSON())
    })
}

const getAll = (request, response) => {
    Colaboradoras.find(function(err, colaboradoras){
        if(err) {
            response.status(500).send({
                message: err.message
            })
        }
        response.status(200).send(colaboradoras)
    }) 
}

const deleteById = async (request, response) => {
    try {
        const id = request.params
        await Colaboradoras.findByIdAndDelete(id)
        const message = `A colaboradora com id: ${id} foi deletada com sucesso`
        response.status(200).json({message})

    } catch (error) {
        console.error(error)
        response.status(500).json({
            message: error.message
        })
    }
}

const login = (request, response) => {
    Colaboradoras.findOne({email: request.body.email}, function(err, colaboradora){
        if (!colaboradora) {
            return response.status(404).send(`Não existe colaboradora com email 
            ${request.body.email}!`)
        }

        const senhaValida = bcrypt.compareSync(request.body.senha, colaboradora.senha)

        if (!colaboradora) {
            return response.status(403).send('Erro ao digitar a senha')
        }
        
        const token = jwt.sign({email: request.body.email}, SECRET)
        return response.status(200).send(token)

    })
}

module.exports = {
    create,
    getAll, 
    deleteById,
    login
}