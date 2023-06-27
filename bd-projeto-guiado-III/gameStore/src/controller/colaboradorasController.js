const colaboradorasModel = require("../models/colaboradorasModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET= process.env.SECRET//assinatura


const create = (req,res)=>{
    const senhaHash = bcrypt.hashSync(req.body.senha,10)// o 10 e a quantidade de caracteres que deseja na criptografia
    req.body.senha = senhaHash

    const colaboradora = new colaboradorasModel(req.body)
    colaboradora.save(function(err){
        if (err) {
         res.status(500).send({message:err.message})   
        } else {
           res.status(201).send(colaboradora.toJSON()) 
        }
    })
}

const getAll = (req,res)=>{
    colaboradorasModel.find(function(err, colaboradoras){
        if(err) {
            res.status(500).send({
                message: err.message
            })
        }res.status(200).send(colaboradoras)
    })
}

const deleteById = async (req,res)=>{
    try {
        const{id} = req.params
        await colaboradorasModel.findByIdAndDelete(id)
        const message = `A colaboradora com o id: ${id} foi deletada`
        res.status(200).json({
            message
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: error.message})
    }
}

const login = (req,res)=>{
    colaboradorasModel.findOne({email: req.body.email}, 
        function(err,colaboradora){
            if (!colaboradora) {
                return res.status(404).send(`não existe`)
            } 
            const senhaValida = bcrypt.compareSync(req.body.senha,colaboradora.senha)

            if(!senhaValida){
                return res.status(403).send("senha errada")
            }
            const token = jwt.sign({email:req.body.email},SECRET)
            return res.status(200).send(token)

        })
}


module.exports={
    create,
    getAll,
    deleteById,
    login    
}