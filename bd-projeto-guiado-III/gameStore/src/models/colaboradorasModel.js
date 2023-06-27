const mongoose = require("mongoose");

const colaboradorasSchema = new mongoose.Schema(
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
        versionKey: false // gera por padrão uma versão para cada atualização do documento, para nao abrir uma voda pasta toda vez q houver uma atualização
    }
)

//atribuindo o schema a uma collection 
//estou definindo o nome da collection que irei salvar no banco
const colaboradoras = mongoose.model("colaboradoras", colaboradorasSchema)

// exportar o model para ser utilizado
module.exports = colaboradoras