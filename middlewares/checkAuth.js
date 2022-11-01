const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {ACCESS_TOKEN_SECRET} = process.env;

module.exports = {
    checkAuth: (req, res, next) => {
        const token = sessionStorage.getItem("accessToken");
        console.log(token)
        if(!token) {
            return res.status(401).json('No token present.');
        }
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                return res.status(403).send(alert('Token not verified.'));
            } else {
                location.assign("/dashboard.html");
            } 
        }); 
    }
}

// (req, res, next) => {
//     console.log(req)
//     const token = req.cookies.accessToken;
//     if(!token) {
//         console.log("No cookie found")
//         return res.status(401).json('Please login again.');
//     }
//     console.log("JWT verification")
//     jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
//         if(err){
//             return res.status(403).send(alert('Please login again.'));
//         } 
//     }); 
//     next();