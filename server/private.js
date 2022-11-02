const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

module.exports = {
    privateRoutes: (req, res) => {
        console.log('req.headers.cookie = ', req.headers.cookie)
        res.status(200).json("You got the private route");
    }
}

