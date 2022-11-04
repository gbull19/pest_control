const express = require('express');
const app = express();

module.exports = {
    privateRoutes: (req, res) => {
        res.status(200).json({ message: "You got the private route" });
    }
}

