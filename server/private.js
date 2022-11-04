const express = require('express');
const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET} = process.env;
const cookieParser = require('cookie-parser');
const app = express();


module.exports = {
    privateRoutes: (req, res) => {
        let accessToken = req.headers.cookie;
        accessToken = accessToken.split("=")[1].replace(/['"]+/g, '');
        let authenticated = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        const { is_tech } = authenticated;
        console.log(is_tech);

        res.cookie('accessToken', `'${accessToken}'`, { maxAge: 60*60*8 });

        res.status(200).json({ message: "You got the private route", admin: is_tech });
    }
}

