const ConsolesModel = require("../models/consolesModel");
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const findAllConsoles = async (req, res) => {
  try {
    const authHeader = req.get('authorization')
    if (!authHeader) {
      return res.status(401).send('No authorization info!')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET, async function (err) {
      if (err) {
        return res.status(403).send('Access not authorized!')
      }
      const allConsoles = await ConsolesModel.find();
      res.status(200).json(allConsoles);
    })
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  };
};

const findConsoleById = async (req, res) => {
  try {
    const authHeader = req.get('authorization')
    if (!authHeader) {
      return res.status(401).send('No authorization info!')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET, async function (err) {
      if (err) {
        return res.status(403).send('Access not authorized!')
      }
      const findConsole = await ConsolesModel.findById(req.params.id);
      res.status(200).json(findConsole)
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  };
};

const addNewConsole = async (req, res) => {
  try {
    const authHeader = req.get('authorization')
    if (!authHeader) {
      return res.status(401).send('No authorizarion info')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET, async function (err) {
      if (err) {
        return res.status(403).send('Access not authorized!');
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
      res.status(201).json({ message: "New console successfully added", savedConsole });
    })
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  };
};

const updateConsole = async (req, res) => {
  try {
    authHeader = req.get('authorization')
    if (!authHeader) {
      return res.status(401).send('No authorizarion info');
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET, async function (err) {
      if (err) {
        return res.status(403).send('Access not authorized!');
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
    authHeader = req.get('authorization')
    if (!authHeader) {
      return res.status(401).send('No authorization info!')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET, async function (err) {
      if (err) {
        return res.status(403).send('Access not authorized!');
      }
      const { id } = req.params;
      const deleteConsole = await ConsolesModel.findByIdAndDelete(id);
      const message = `Console with id ${deleteConsole.name} was successfully deleted`;
      res.status(200).json({ message });
    })
  } catch (error){
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