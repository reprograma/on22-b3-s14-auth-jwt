
const mongoose = require("mongoose");

const colaboradoraSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    nome: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    senha: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);


const Model = mongoose.model("Colaboradora", colaboradoraSchema);

module.exports = Model;