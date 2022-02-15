const mongoose = require('mongoose');
//always use async fun for db
// add uri in config.env
const MONGO_URI = "mongodb+srv://aks:aks123@cluster0.f01yf.mongodb.net/resetPassword?retryWrites=true&w=majority"
const connectDB = async () => {
    await mongoose.connect(MONGO_URI)
    //useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. 

    console.log("MONGODB CONNECTED!!!")
}

//export it to server.js

module.exports = connectDB