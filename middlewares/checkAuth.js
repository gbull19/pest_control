const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {ACCESS_TOKEN_SECRET} = process.env;

module.exports = {
    checkAuth: (req, res, next) => {
        let token = req.headers.cookie;
        token = token.split("=")[1].replace(/['"]+/g, '')
        if(!token) {
            return res.status(401).json({message: 'Please login again.'});
        }
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                return res.status(403).json({ message: 'Please login again.'});
            } 
        }); 
        next();
    }
}