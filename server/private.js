const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

module.exports = {
    privateRoutes: (req, res) => {
        location.assign("/dashboard.html");
        res.status(200).json("You got the private route");
    }
}

