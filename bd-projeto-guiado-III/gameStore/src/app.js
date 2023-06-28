require("dotenv").config();
const express = require("express");
const cors = require("cors");

const mongoose = require("./database/dbConnect");
const gamesRoutes = require("./routes/gamesRoute");
const consolesRoutes = require("./routes/consolesRoute");
const colaboradorasRoute = require("./routes/colaboradorasRoute")

const app = express();

app
  .use(express.json())
  .use(cors());

mongoose.connect();

app
  .use("/gamestore/consoles", consolesRoutes)
  .use("/gamestore/games", gamesRoutes)
  .use("/gamestore", colaboradorasRoute)

module.exports = app;