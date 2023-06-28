const consolesModel = require('../models/consolesModel');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET

const findAllConsoles = async (req, res) => {
    try {
        const authHeader = req.get('authorization')
        if (!authHeader) {
            return res.status(401).send("Sem autorizações fornecidas.")
        }
        const token = authHeader.split(" ")[1]
        const invalidToken = jwt.verify(token, SECRET, (err) => { return err })
        if (invalidToken) {
            return res.status(403).send("Acesso negado: não autorizada")
        }
        const consoles = await consolesModel.find({});
        res.status(200).send(consoles);
    } catch (error) {
        res.status(500).send(error)
    }
}

const findAvailable = async (req, res) => {
    try {
        const authHeader = req.get('authorization')
        if (!authHeader) {
            return res.status(401).send("Sem autorizações fornecidas.")
        }
        const token = authHeader.split(" ")[1]
        const invalidToken = jwt.verify(token, SECRET, (err) => { return err })
        if (invalidToken) {
            return res.status(403).send("Acesso negado: não autorizada")
        }
        const availableConsole = await consolesModel.find({ available: true })
        if (Object.keys(availableConsole).length != 0) {
            res.status(200).json(availableConsole)
        } else {
            res.status(404).send("Not Found!")
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

const findByDev = async (req, res) => {
    try {
        const authHeader = req.get('authorization')
        if (!authHeader) {
            return res.status(401).send("Sem autorizações fornecidas.")
        }
        const token = authHeader.split(" ")[1]
        const invalidToken = jwt.verify(token, SECRET, (err) => { return err })
        if (invalidToken) {
            return res.status(403).send("Acesso negado: não autorizada")
        }
        const consoleDev = await consolesModel.find({ developer: { $regex: req.query.dev, $options: 'i' } });
        if (Object.keys(consoleDev).length == 0) {
            res.status(404).send("Not Found!");
        } else {
            res.status(200).json(consoleDev)
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

const findConsoleById = async (req, res) => {
    try {
        const authHeader = req.get('authorization')
        if (!authHeader) {
            return res.status(401).send("Sem autorizações fornecidas.")
        }
        const token = authHeader.split(" ")[1]
        const invalidToken = jwt.verify(token, SECRET, (err) => { return err })
        if (invalidToken) {
            return res.status(403).send("Acesso negado: não autorizada")
        }
        const foundConsole = await consolesModel.findById(req.params.id)
        res.status(200).json(foundConsole)
    } catch (error) {
        res.status(404).send(`O ID ${error.value} não foi encontrado.`)
    }
}

const updateConsole = async (req, res) => {
    try {
        const authHeader = req.get('authorization')
        if (!authHeader) {
            return res.status(401).send("Sem autorizações fornecidas.")
        }
        const token = authHeader.split(" ")[1]
        const invalidToken = jwt.verify(token, SECRET, (err) => { return err })
        if (invalidToken) {
            return res.status(403).send("Acesso negado: não autorizada")
        }
        const updated = await consolesModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json([{
            msg: "Updated successfully!"
        }])
    } catch (error) {
        res.status(400).send(`Houve um erro ao atualizar o ID ${error.value}.`)
    }
}

const deleteConsole = async (req, res) => {
    try {
        const authHeader = req.get('authorization')
        if (!authHeader) {
            return res.status(401).send("Sem autorizações fornecidas.")
        }
        const token = authHeader.split(" ")[1]
        const invalidToken = jwt.verify(token, SECRET, (err) => { return err })
        if (invalidToken) {
            return res.status(403).send("Acesso negado: não autorizada")
        }

        const deleted = await consolesModel.findByIdAndDelete(req.params.id)
        res.status(200).json([{ msg: "Console Deleted", deleted }])
    } catch (error) {
        res.status(404).send(`ID ${error.value} não encontrado.`)
    }
}

const addNewConsole = async (req, res) => {
    try {
        const authHeader = req.get('authorization')
        if (!authHeader) {
            return res.status(401).send("Sem autorizações fornecidas.")
        }
        const token = authHeader.split(" ")[1]
        const invalidToken = jwt.verify(token, SECRET, (err) => { return err })
        if (invalidToken) {
            return res.status(403).send("Acesso negado: não autorizada")
        }
        const newConsole = new consolesModel(req.body)
        const create = await consolesModel.create(newConsole)

        return res.status(201).json([{
            msg: "Console added successfully!", newConsole
        }])
    } catch (error) {
        if (error.code === 11000) {
            res.status(500).send("Console já cadastrado")
        } else {
            res.status(500).json(error.message)
        }
    }
}



module.exports = {
    findAllConsoles,
    findConsoleById,
    addNewConsole,
    updateConsole,
    deleteConsole,
    findAvailable,
    findByDev
}