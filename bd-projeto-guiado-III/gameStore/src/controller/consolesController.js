const ConsolesModel = require("../models/consolesModel");

const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const findAllConsoles = async (req, res) => {
  try {

    const authHeader = req.get('authorization'); // pega o cabeçalho de autorização


    if (!authHeader) { //trata o erro ao esquecer de passar o token 
      return res.status(401).send('Você esqueceu de passar as informações de autorização');
    }

    const token = authHeader.split(' ')[1]; //separa as informações do cabeçalho em um array de 2 posições

    jwt.verify(token, SECRET, async function (erro) { // verifica o token passado e a SECRET  
      if (erro) {
        return res.status(403).send('Acesso não autorizado'); // função para tratar erro de autorização
      }

      const allConsoles = await ConsolesModel.find();
      res.status(200).json(allConsoles);
    })
  } catch {
    console.log(error);
    res.status(500).json({ message: error.message });
  };
};

const findConsoleById = async (req, res) => {
  try {
    const authHeader = req.get('authorization'); // pega o cabeçalho de autorização


    if (!authHeader) { //trata o erro ao esquecer de passar o token 
      return res.status(401).send('Você esqueceu de passar as informações de autorização');
    }

    const token = authHeader.split(' ')[1]; //separa as informações do cabeçalho em um array de 2 posições

    jwt.verify(token, SECRET, async function (erro) { // verifica o token passado e a SECRET  
      if (erro) {
        return res.status(403).send('Acesso não autorizado'); // função para tratar erro de autorização
      }

      const findConsole = await ConsolesModel.findById(req.params.id);
      res.status(200).json(findConsole);

    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  };
};

const addNewConsole = async (req, res) => {
  try {
    const authHeader = req.get('authorization'); // pega o cabeçalho de autorização

    if (!authHeader) { //trata o erro ao esquecer de passar o token 
      return res.status(401).send('Você esqueceu de passar as informações de autorização');
    }

    const token = authHeader.split(' ')[1]; //separa as informações do cabeçalho em um array de 2 posições

    jwt.verify(token, SECRET, async function (erro) { // verifica o token passado e a SECRET  
      if (erro) {
        return res.status(403).send('Acesso não autorizado'); // função para tratar erro de autorização
      }

      const {
        name,
        developer,
        releaseDate,
        display,
        storageCapacities,
        numberOfPlayers,
        available,
        description,
      } = req.body;
      const newConsole = new ConsolesModel({
        name,
        developer,
        releaseDate,
        display,
        storageCapacities,
        numberOfPlayers,
        available,
        description,
      });

      const savedConsole = await newConsole.save();

      return res.status(201).json({ message: "New console successfully added", savedConsole });
    })
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  };
};

const updateConsole = async (req, res) => {
  try {
    const authHeader = req.get('authorization'); // pega o cabeçalho de autorização

    if (!authHeader) { //trata o erro ao esquecer de passar o token 
      return res.status(401).send('Você esqueceu de passar as informações de autorização');
    }

    const token = authHeader.split(' ')[1]; //separa as informações do cabeçalho em um array de 2 posições

    jwt.verify(token, SECRET, async function (erro) { // verifica o token passado e a SECRET  
      if (erro) {
        return res.status(403).send('Acesso não autorizado'); // função para tratar erro de autorização
      }

      const {
        name,
        developer,
        releaseDate,
        display,
        storageCapacities,
        numberOfPlayers,
        available,
        description,
      } = req.body;
      const updateConsole = await ConsolesModel.findByIdAndUpdate(req.params.id, {
        name,
        developer,
        releaseDate,
        display,
        storageCapacities,
        numberOfPlayers,
        available,
        description,
      });

      res.status(200).json({ message: "Console successfully updated", updateConsole });
    })
  } catch {
    console.error(error);
    res.status(500).json({ message: error.message });
  };
};

const deleteConsole = async (req, res) => {
  try {
    const authHeader = req.get('authorization'); // pega o cabeçalho de autorização


    if (!authHeader) { //trata o erro ao esquecer de passar o token 
      return res.status(401).send('Você esqueceu de passar as informações de autorização');
    }

    const token = authHeader.split(' ')[1]; //separa as informações do cabeçalho em um array de 2 posições

    jwt.verify(token, SECRET, async function (erro) { // verifica o token passado e a SECRET  
      if (erro) {
        return res.status(403).send('Acesso não autorizado'); // função para tratar erro de autorização
      }

      const { id } = req.params;
      const deleteConsole = await ConsolesModel.findByIdAndDelete(id);
      const message = `Console with id ${deleteConsole.name} was successfully deleted`;
      res.status(200).json({ message });
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  };
};

module.exports = {
  findAllConsoles,
  findConsoleById,
  addNewConsole,
  updateConsole,
  deleteConsole,
};