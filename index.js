//basic express server boiler plate
require('dotenv').config({ path: './config.env' })
const express = require('express');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const cors = require("cors");
//ensure this files musty above all so that evertything below have access to it

//run DB function 
connectDB();

const app = express();

//middleware that allow us to get data from body
app.use(cors());
app.use(express.json());

// if anything (api/auth) middleware redirect it to routes/auth
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));

//this must be last piece of middleware
app.use(errorHandler);


//let heroku decide port number
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`server running on ${PORT}`));

//better error handling
process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error:${err}`)
    server.close(() => process.exit(1))
})