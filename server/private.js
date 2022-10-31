const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

module.exports = {
    privateRoutes: (req, res) => {
        document.location.href="http://localhost:5500/Pest_control/public/dashboard.html";
        res.status(200).json("You got the private route");
    }
}

