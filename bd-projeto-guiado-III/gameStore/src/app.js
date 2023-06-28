const express = require('express')
const connectToDB = require('./database/dbConnect')
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());


const gamesRoutes = require('./routes/gamesRoutes');
const consoleRoutes = require('./routes/consolesRoutes');
const colaboradorasRoutes = require('./routes/colaboradorasRoute');


app.use('/gs/games', gamesRoutes);
app.use('/gs/consoles', consoleRoutes);
app.use("/gs", colaboradorasRoutes);

connectToDB();

module.exports = app;