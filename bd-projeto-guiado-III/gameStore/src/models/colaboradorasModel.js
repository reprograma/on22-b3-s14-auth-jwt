const mongoose = require("mongoose")

// schima das colaboradoras
const colaboradorasSchema = new mongoose.Schema(
    { // payload (modelo de estrutura de login e senha)
        nome: {
            type: String
        },
        email: {
            type: String 
        },
        senha: {
            type: String
        }
    }, 
    {
        versionKey: false 
    }
)

const colaboradoras = mongoose.model("colaboradoras", colaboradorasSchema) 

module.exports = colaboradoras