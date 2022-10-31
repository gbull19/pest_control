const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {ACCESS_TOKEN_SECRET} = process.env;

module.exports = {
    checkAuth: (req, res, next) => {
        const token = req.cookies.accessToken;
        if(!token) {
            console.log("No cookie found")
            return res.status(401).json('Please login again.');
        }
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                return res.status(403).send(alert('Please login again.'));
            } else {
                next();
            }
        })
    }
}