const mongoose = require('mongoose')

const colaboradorasSchema = new mongoose.Schema(
    {
        nome: { type: String },
        email: { type: String },
        senha: { type: String }
    },
    {
        versionKey: false //gera por padrão uma versao de atualização do documento. não quer q altera toda hora a informação, fazendo uma nova verão do Schema, então colocou false
    }
)

const colaboradoras = mongoose.model('colaboradoras', colaboradorasSchema)


module.exports = colaboradoras