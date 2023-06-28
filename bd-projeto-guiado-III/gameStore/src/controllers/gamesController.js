const GamesModel = require('../models/gamesModel');
const consoleModel = require('../models/consolesModel')

const findAllGames = async (req, res) => {
    try {
        const games = await GamesModel.find({});
        res.status(200).send(games);
    } catch (error) {
        res.status(500).send(error)
    }
}

const findGameById = async (req, res) => {
    try {
        const foundGame = await GamesModel.findById(req.params.id).populate('console')
        res.status(200).json(foundGame)

    } catch (error) {
        res.status(404).send(`O ID ${error.value} não foi encontrado.`)
    }
}

const addNewGame = async (req, res) => {
    try {
        if (req.body.console.length == 0) {
            res.status(400).send("Please inform a Console.")
        } else {
            const consoleID = await consoleModel.findOne({ name: { $regex: req.body.console, $options: 'i' } }, '_id')
            if (!consoleID) {
                res.status(404).send("Console not found.")
            } else {
                req.body.console = consoleID._id;
                const newGame = new GamesModel(req.body)
                
                const create = await GamesModel.create(newGame)
                if (create) {
                    res.status(201).json({ msg: "Cadastro com sucesso!", newGame })
                }
            }
        }
    } catch (error) {
        res.status(500).send("error")
    }
}

const updateGame = async (req, res) => {
    try {
        const updated = await GamesModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json([{
            msg: "Updated successfully!"
        }])
    } catch (error) {
        res.status(400).send(`Houve um erro ao atualizar o ID ${error.value}.`)
    }
}

const deleteGame = async (req, res) => {
    try {
        const deleted = await GamesModel.findByIdAndDelete(req.params.id)
        res.status(200).json([{ msg: "Game Deleted", deleted }])

    } catch (error) {
        res.status(404).send(`ID ${error.value} não encontrado.`)
    }
}


module.exports = {
    findAllGames,
    findGameById,
    addNewGame,
    updateGame,
    deleteGame
}