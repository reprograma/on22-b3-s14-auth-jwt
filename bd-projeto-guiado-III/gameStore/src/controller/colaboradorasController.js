const colaboradorasModel = require('../models/colaboradorasModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET //no login bota assinatura, então chama aq

const create = (req,res)=>{
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10) //transforma a senha em hash, embaralhando
    req.body.senha = senhaComHash //coloca a senha embaralhada 

    const colaboradora = new colaboradorasModel(req.body)  //lê 
    colaboradora.save(function(err){
        if(err){
            res.status(500).send({message: err.message})
        }
        res.status(201).send(colaboradora.toJSON())
    })
}


const getAll = (req,res)=>{
    colaboradorasModel.find(function(err, colaboradoras){
        if(err){
            res.status(500).send({message: err.message})
        }
        res.status(200).send(colaboradoras)
    })
}

const deleteById = async (req,res)=>{
    try {
        const {id} = req.params
        await colaboradorasModel.findByIdAndDelete(id)
        const message = `Colaborator by id ${id} was successfully deleted`
        res.status(200).json({message})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: error.message})
    }
}

const login = (req,res)=>{
    colaboradorasModel.findOne({email: req.body.email}, function(err, colaboradoras){
        if(!colaboradoras){
            return res.status(404).send(`No colaborator was found with the following email address ${req.body.email}`)
        }//achando o email que vc colocou no post lá

        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradoras.senha)

        if(!senhaValida){
            return res.status(403).send('Error when typing password')
        }
        //fazendo token
        const token = jwt.sign({email: req.body.email}, SECRET)
        return res.status(200).send(token) //mandando de volta o token
    }) 

}

module.exports= {
    create,
    getAll,
    deleteById,
    login
}