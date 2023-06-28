const Colaboradoras = require('../models/colaboradorasModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const create = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPass = await bcrypt.hash(senha, 10);
    const colaboradora = new Colaboradoras({
      nome,
      email,
      senha: hashedPass,
    });
    await colaboradora.save();
    res
      .status(201)
      .json({ colaboradora });
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message });
  }
}

const getAll = async (req, res) => {
  try {
    // Adicionei autenticação nessa rota pois não é seguro
    // permitir que usuários não cadastrados acessem dados.
    const authHeader = req.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization info!');
    }
    const token = authHeader.split(' ')[1];
    await jwt.verify(token, SECRET);
    const colaboradoras = await Colaboradoras.find();
    res.status(200).json({ colaboradoras });
  } catch (err) {
    if (err.message === 'No authorization info!') {
      return res
        .status(401)
        .send(err.message);
    } else if (err.message === 'JsonWebTokenError') {
      return res
        .status(403)
        .send('Access not authorized!');
    } else {
      return res
        .status(500)
        .send({ message: err.message });
    }
  }
};

const deleteByID = async (req, res) => {
  try {
    // Adicionei autenticação nessa rota pois não é seguro
    // permitir que usuários não cadastrados deletem dados.
    const authHeader = req.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization info!');
    }
    const token = authHeader.split(' ')[1];
    await jwt.verify(token, SECRET);
    const { id } = req.params;
    await Colaboradoras.findByIdAndDelete(id);
    const message = `A colaboradora com o id ${id} foi deletada com sucesso`;
    return res.status(200).json({ message });
  } catch (err) {
    if (err.message === 'No authorization info!') {
      return res
        .status(401)
        .send(err.message);
    } else if (err.message === 'JsonWebTokenError') {
      return res
        .status(403)
        .send('Access not authorized!');
    } else {
      return res
        .status(500)
        .send({ message: err.message });
    }
  }
};

const login = async (req, res) => {
  try {
    const colaboradora = await Colaboradoras.findOne({
      email: req.body.email,
    });
    if (!colaboradora) {
      throw new Error('Colaborator not found!');
    }

    const senhaValida = bcrypt.compareSync(
      req.body.senha,
      colaboradora.senha
    );

    if (!senhaValida) {
      throw new Error('Wrong password!');
    }

    const token = jwt.sign({ email: req.body.email }, SECRET);
    return res.status(200).send(token);
  } catch (err) {
    if (err.message === 'Wrong password!') {
      return res
        .status(403)
        .send('Access not authorized!');
    } else {
      return res
        .status(404)
        .send({
          message: `Não existe colaboradora com o email ${req.body.email}`,
        });
    }
  }
};


module.exports = {
  create,
  getAll,
  deleteByID,
  login
};