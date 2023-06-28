const mongoose = require ("mongoose")
const colaboradorasSchrema = new mongoose.Schema(
    {
        nome: {
            type: String,
            
        },
        email: {
            type: String,
        },
        senha: {
            type: String
        }
    },
    {
        versionKey: false
    }
)
const colaboradoras = mongoose.model("colaboradoras", colaboradorasSchrema)
module.exports = colaboradoras
