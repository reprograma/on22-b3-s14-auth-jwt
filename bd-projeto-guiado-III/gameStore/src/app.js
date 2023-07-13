require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./database/dbConnect");
const consolesRoutes = require("./routes/consolesRoute");
const gamesRoutes = require("./routes/gamesRoute");
const router = express.Router();
const colaboradorasRoutes = require("./routes/colaboradorasRoutes");
const authMiddleware = require("./middlewares/auth");
const authController = require("./controller/authController")

const app = express();

app.use(express.json());
app.use(cors());
mongoose.connect();

// auth
router.post("/gamestore/colaboradoras", authController.signUp);
router.post("/gamestore/login", authController.login);

app.use(router)

app.use("/gamestore/consoles", authMiddleware, consolesRoutes);
app.use("/gamestore/games", authMiddleware, gamesRoutes);
app.use("/gamestore/colaboradoras", authMiddleware, colaboradorasRoutes);

module.exports = app;
