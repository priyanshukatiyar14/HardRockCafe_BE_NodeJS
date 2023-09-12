const express = require('express');
const router = express.Router();

// Local Modules
const mycontroller = require('./authcontroller.js');

// Requests
router.post('/signup', mycontroller.usersignup);
router.post('/login', mycontroller.userlogin);
router.post('/refreshtoken', mycontroller.refreshtoken);

module.exports = router;