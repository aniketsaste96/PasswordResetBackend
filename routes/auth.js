const express = require('express');
const router = express.Router();

//import from controller > auth
//destructure it
const { register, login, forgotPassword, resetPassword, test } = require('../controllers/auth.js')

//here create diff routes
// same like router.post('/register',())
//keeping things simple and redable
// see the methods imp
router.route('/register').post(register)
router.route('/test').get(test)
router.route('/login').post(login)
router.route('/forgotpassword').post(forgotPassword)
router.route('/passwordreset/:resetToken').put(resetPassword)
//reset password put coz we are sending token







module.exports = router;