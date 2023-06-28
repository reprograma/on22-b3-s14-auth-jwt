const DB_URI = process.env.DB_URI
const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        mongoose.connect(
            DB_URI,
            {   
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        console.log("Connected to mongoDB r-library.")
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDB;