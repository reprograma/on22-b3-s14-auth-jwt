require("dotenv").config();
const express = require("express");
const connectToDB = require("express")
const cors = require("cors");
const mongoose = require("./database/dbConnect");
const consolesRoutes = require("./routes/consolesRoute");
const gamesRoutes = require("./routes/gamesRoute");
const colaboradorasRoutes = require("./routes/colaboradorasRoute")

const app = express();

app.use(express.json());
app.use(cors());
mongoose.connect();

app.use("/gamestore/consoles",consolesRoutes);
app.use("/gamestore/games",gamesRoutes);
app.use("/gamestore", colaboradorasRoutes);

connectToDB();

module.exports = app;

