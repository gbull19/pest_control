const express = require('express');
const app = express();

module.exports = {
    privateRoutes: (req, res) => {
        window.location.href = "http://localhost:5500/Pest_control/public/dashboard.html"
        res.json("You got the private route");
    }
}

