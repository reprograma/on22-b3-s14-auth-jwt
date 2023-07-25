const mongoose = require("mongoose")

const colaboradoraSchema = new mongoose.Schema(
    {
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

const colaboradoras = mongoose.model("colaboradoras", colaboradoraSchema)

module.exports = colaboradoras