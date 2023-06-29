const ColaboradorasModel = require("../models/colaboradorasModels")
const bcrypt = require("bcrypt") //serve pra encriptar nossa senha

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10) //é um metodo da funçao hashsync
    //transforma a senha em hash, embaralhando
    req.body.senha = senhaComHash; 
    //coloca a senha embaralhada
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