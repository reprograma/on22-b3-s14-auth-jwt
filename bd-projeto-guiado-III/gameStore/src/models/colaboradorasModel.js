const mongoose = require("mongoose");

const ColaboradorasSchema = new mongoose.Schema({
  nome: {
    type: String
  },
  email:{
    type: String
  },
  senha: {
    type: String
  }
}, {versionKey: false});

const colaboradoras = mongoose.model("colaboradoras", ColaboradorasSchema);

module.exports = colaboradoras;