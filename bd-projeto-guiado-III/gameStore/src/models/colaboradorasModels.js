const mongoose = require("mongoose")

//estrutura do seu model (atributos da sua entidade)
const colaboradorasSchema = new mongoose.Schema(
    {
        nome: 
        {
            type: String
        },
        email: 
        {
            type: String
        },
        senha: 
        {
            type: String
        },
    },
    {
        versionKey: false  //gera por padrão uma versão para cada atualização do documento
    }
)

// atribuindo o esquema a uma collection
// estou definindo o nome da collection que irei salvar no banco de dados
const colaboradoras = mongoose.model("colaboradoras", colaboradorasSchema)

// exportar o model para ser utilizado
module.exports = colaboradoras
