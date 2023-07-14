const ColaboradorasModel = require("../models/colaboradorasModels")
const bcrypt = require("bcrypt") //serve pra encriptar nossa senha

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10) //é um metodo da funçao hashsync
    //transforma a senha em hash, embaralhando
    req.body.senha = senhaComHash; 
    
    const colaboradora = new ColaboradorasModel(req.body);
    colaboradora.save(function (err) {
        if (err) {
            res.status(500).send({message: err.message})
        } 
        res.status(201).send(colaboradora.toJSON())
    })
}

const getAll = (req, res) => {
    ColaboradorasModel.find(function(err, colaboradoras){
        if(err) {
            res.status(500).send({
                message: err.message})
        }
        res.status(200).send(colaboradoras)
    }) 
}

const deleteById = async (req,res) => {
    try {
        const {id} =  req.params
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
