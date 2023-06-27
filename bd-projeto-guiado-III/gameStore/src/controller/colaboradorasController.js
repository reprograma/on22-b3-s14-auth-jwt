const colaboradorasModel = require("../models/colaboradorasModel"); //chamando obj que vem do bancos de dados
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const create = (req, res) => {
  const senhaComHash = bcrypt.hashSync(req.body.senha, 10); //transforma a senha em hash, embaralhando
  req.body.senha = senhaComHash; //converte a senha/ coloca a senha embaralhada

  const colaboradora = new colaboradorasModel(req.body);
  colaboradora.save(function (err) {
    // salva nova colaboradora
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    }
    res.status(201).send(colaboradora.toJSON());
  });
};

const getAll = (req, res) => {
  colaboradorasModel.find(function (err, colaboradoras) {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    }
    res.status(200).send(colaboradoras);
  });
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    await colaboradorasModel.findByIdAndDelete(id);
    const message = `A colaboradora com o ${id} foi delatado com sucesso!`;
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = (req, res) => {
  colaboradorasModel.findOne(
    {
      email: req.body.email,
    },
    function (err, colaboradora) {
      if (!colaboradora) {
        return res.status(404).send(`Não existe colaboradora com esse email ${req.bory}`);
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
