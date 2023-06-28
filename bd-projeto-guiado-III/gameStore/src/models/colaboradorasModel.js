const mongoose = require('mongoose')

const colaboradorasSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        senha: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false
    }
)

const colaboradoras = mongoose.model('colaboradoras', colaboradorasSchema)

module.exports = colaboradoras