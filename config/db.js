const mongoose = require('mongoose');
//always use async fun for db
// add uri in config.env
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    //useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. 

    console.log("MONGODB CONNECTED!!!")
}

//export it to server.js

module.exports = connectDB