
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const Colaboradora = require("../models/colaboradorasModel")


const login = async (req, res) => {
  try {
    const colaboradora = await Colaboradora.findOne({ email: req.body.email });
    if (!colaboradora) {
      return res.status(404).json({ message: error.message });
    }

    const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha);
    if (!senhaValida) {
      return res.status(403).json({ message: "erro ao digitar a senha" });
    }

    const token = jwt.sign({ email: req.body.email }, SECRET);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const signUp = async (req, res) => {
  try {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10);
    req.body.senha = senhaComHash;

    const colaboradora = new Colaboradora(req.body);

    const colaboradoraCriada = await colaboradora.save();

    return res.status(201).json(colaboradoraCriada);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  login, 
  signUp
}