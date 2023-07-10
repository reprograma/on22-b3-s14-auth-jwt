const Colaboradoras = require("../models/colaboradorasModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const create = (req, res) => {
  const senhaComHash = bcrypt.hashSync(req.body.senha, 10);
  //transforma a senha  em hash, embaralhando
  req.body.senha = senhaComHash;
  //coloca a senha embaralhada

  const colaboradora = new Colaboradoras(req.body); //add ao modelo
  colaboradora.save(function (err) {
    //salva a nova colcaboradora
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    }
    res.status(201).send(colaboradora.toJSON());
  });
};

const getAll = (req, res) => {
  Colaboradoras.find(function (err, colaboradora) {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    }
    res.status(200).send(colaboradora);
  });
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    await Colaboradoras.findByIdAndDelete(id);
    const message = `A colaboradora com o id: ${id} foi deletada com sucesso!`;
    res.status(200).json({
      message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = (req, res) => {
  Colaboradoras.findOne(
    { email: req.body.email },
    function (err, colaboradora) {
      if (!colaboradora) {
        return res
          .status(404)
          .send(`Nao existe colaboradora com o email: ${req.body.email}!`);
      }

      const senhaValida = bcrypt.compareSync(
        req.body.senha,
        colaboradora.senha
      );

      if (!senhaValida) {
        return res.status(403).send("Erro ao digitar a senha");
      }

      const token = jwt.sign({ email: req.body.email }, SECRET);
      return res.status(200).send(token);
    }
  );
};

module.exports = {
  create,
  getAll,
  deleteById,
  login,
};
