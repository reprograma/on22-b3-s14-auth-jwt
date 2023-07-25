const colaboradoras = require("../models/colaboradorasModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

const create = (req, res) => {
   
    const authHeader = req.get('authorization'); 

    if (!authHeader) { 
      return res.status(401).send('Você esqueceu de passar as informações de autorização'); 
    }
  
    const token = authHeader.split(' ')[1]; 
  
  
    jwt.verify(token, SECRET, function(erro) { 
      if (erro) {
        return res.status(403).send('Acesso não autorizado');
      }
  })

    const senhaComHash = bcrypt.hashSync(req.body.senha, 10)
    req.body.senha = senhaComHash

    const colaboradora = new colaboradoras(req.body)
    colaboradora.save(function(err) {
        if (err) {
            res.status(500).send({message: err.message})
        }
        res.status(201).send(colaboradora.toJSON())
    })
}

const getAll = (req, res) => {
    colaboradoras.find(function(err, colaboradora2){
        if(err){
            res.status(500).send({
                message: err.message
            })
        }
        res.status(200).send(colaboradora2)
    })
}


const deleteById = async (req, res) => {
    try {
        const {id} = req.params
        await colaboradoras.findByIdAndDelete(id)
        const message = `${id} deleted :D`
        res.status(200).json({message})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: error.message})
    }
};

const login = (req, res) => {
   
    const authHeader = req.get('authorization'); 

  if (!authHeader) { 
    return res.status(401).send('Você esqueceu de passar as informações de autorização'); 
  }

  const token = authHeader.split(' ')[1]; 


  jwt.verify(token, SECRET, function(erro) { 
    if (erro) {
      return res.status(403).send('Acesso não autorizado');
    }
})
    
    
    colaboradoras.findOne({ email: req.body.email }, function (error, colaboradora) {
        if (!colaboradora) {
            return res.status(404).send(`there is none email called ${req.body.email} at our system :(`);
        }
        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha); 

        if (!senhaValida) {

            return res.status(403).send('erro ao digitar a senha');
        }
        const token = jwt.sign({ email: req.body.email }, SECRET);
        return res.status(200).send(token);
    });
}



module.exports = {
    create,
    getAll,
    deleteById,
    login
}