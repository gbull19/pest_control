const express = require('express');
// const jwt = require('jsonwebtoken');
// const {ACCESS_TOKEN_SECRET} = process.env;
// const cookieParser = require('cookie-parser');
const app = express();

module.exports = {
    privateRoutes: (req, res) => {
        res.status(200).json({ message: "You got the private route" });
    }
}

