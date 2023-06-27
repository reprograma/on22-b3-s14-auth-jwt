const GamesModel = require("../models/gamesModel");
const ConsolesModel = require("../models/consolesModel");

const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const findAllGames = async (req, res) => {
  try {
    const authHeader = req.get("authorization")

    if(!authHeader) {
      return res.status(401).send("Você esqueceu de passar as informações de autorização!")
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, SECRET, async function(error) {
      if(error) {
        return res.status(403).send("Acesso não autorizado.")
      }

      const allGames = await GamesModel.find().populate("console");
    res.status(200).json(allGames);
    })
  } catch {
    res.status(500).json({ message: error.message });
  };
};

const findGameById = async (req, res) => {
  try {
    const authHeader = req.get("authorization")

    if(!authHeader) {
      return res.status(401).send("Vpcê esqueceu de passar as informações de autorização!")
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, SECRET, async function(error) {
      if(error) {
        return res.status(403).send("Acesso não autorizado")
      }

      const findGame = await GamesModel.findById(req.params.id).populate(
        "console"
      );
      if (findGame == null) {
        res.status(404).json({ message: "Game not available" });
      }
      res.status(200).json(findGame);
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

const addNewGame = async (req, res) => {
  try {
    const authHeader = req.get("authorization")

    if(!authHeader) {
      return res.status(401).send("Você esqueceu de passar as informações de autorização")
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, SECRET, async function(error) {
      if(error) {
        return res.status(403).send("Acesso não autorizado")
      }

      const {
        consoleId,
        name,
        developer,
        releaseDate,
        genre,
        mode,
        available,
        description,
      } = req.body;
  
      if (!consoleId) {
        return res
          .status(400)
          .json({ message: "Required: Enter the Console id." });
      };
  
      const findConsole = await ConsolesModel.findById(consoleId);
  
      if (!findConsole) {
        return res.status(404).json({ message: "Console not found" });
      };
  
      const newGame = new GamesModel({
        console: consoleId,
        name,
        developer,
        releaseDate,
        genre,
        mode,
        available,
        description,
      });
      const savedGame = await newGame.save();
      res
        .status(200)
        .json({ message: "New game added successfully!", savedGame });
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  };
};

const updateGame = async (req, res) => {
  try {
    const authHeader = req.get("authorization")

    if(!authHeader) {
      return res.status(401).send("Você esqueceu de passar as informações de autorização!")
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, SECRET, async function(error) {
      if(error) {
        return res.status(403).send("Acesso não autorizado.")
      }

      const { id } = req.params;
    const {
      consoleId,
      name,
      developer,
      releaseDate,
      genre,
      mode,
      available,
      description,
    } = req.body;
    const findGame = await GamesModel.findById(id);
    if (findGame == null) {
      res.status(404).json({ message: "Game not found" });
    };

    if (consoleId) {
      const findConsole = await ConsolesModel.findById(consoleId);

      if (findConsole == null) {
        return res.status(404).json({ message: "Console not found" });
      };
    };
    findGame.name = name || findGame.name;
    findGame.developer = developer || findGame.developer;
    findGame.releaseDate = releaseDate || findGame.releaseDate;
    findGame.genre = genre || findGame.genre;
    findGame.mode = mode || findGame.mode;
    findGame.available = available || findGame.available;
    findGame.description = description || findGame.description;
    findGame.console = consoleId || findGame.console;

    const savedGame = await findGame.save();
    res.status(200).json({ message: "Game successfully updated", savedGame });
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

const deleteGame = async (req, res) => {
  try {
    const authHeader = req.get("authorization")

    if(!authHeader) {
      return res.status(401).send("Você esqueceu de passar as informações de autorização!")
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, SECRET, async function(error){
      if(error) {
        return res.status(403).send("Acesso não autorizado")
      }

      const { id } = req.params;
    const findGames = await GamesModel.findByIdAndDelete(id);

    if (findGames == null) {
      return res.status(404).json({ message: `Game with id ${id} not found` })
    };
    
    res.status(200).json({ message: `Game with id ${id} was successfully deleted` });
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

module.exports = {
  findAllGames,
  findGameById,
  addNewGame,
  updateGame,
  deleteGame,
};