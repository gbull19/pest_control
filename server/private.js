const express = require('express');
const app = express();

module.exports = {
    privateRoutes: (req, res) => {
        res.json("You got the private route");
    }
}

