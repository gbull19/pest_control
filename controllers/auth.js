const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = process.env;
const { Sequelize, OP, QueryTypes } = require("sequelize");
const { cookie, clearCookie } = require("cookie-parser");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = {

    register: async (req, res) => {
        const {first_name, last_name, email, street_address, city, state, is_tech, password} = req.body;
        const hashPassword = bcrypt.hashSync(password, salt);
        let [[user]] = await sequelize.query(`
            SELECT email FROM users
            WHERE email = ?;
        `, {
            replacements: [email],
            type: QueryTypes.INSERT
        });
        if (user) {return (alert('User already exists'))};
        await sequelize.query(
            `WITH ins AS (
                INSERT INTO users (first_name, last_name, email, password, is_tech)
                VALUES ( ?, ?, ?, '${hashPassword}', '0')
                RETURNING user_id
            )
            INSERT INTO user_address (street_address, city, state, user_id)
            VALUES (?, ?, ?, (SELECT user_id FROM ins))`,
            {
                replacements: [first_name, last_name, email, street_address, city, state],
                type: QueryTypes.INSERT
            }
        )
        .then(() => {
            console.log('Registration complete')
            res.status(200).json({message: "Registration successful"})
        }).catch(err => 
            console.log('Error seeding DB', err),
            res.status(400)
        );
    },


    login: async (req, res) => {
        const {email, password} = req.body;
        let hashPassword =  await sequelize.query(
            `SELECT password FROM users
            WHERE email = ?`,
            {
                replacements: [email],
                type: QueryTypes.INSERT
            }
            );
        hashPassword = hashPassword[0][0].password;
        console.log("password = ", password)
        console.log("hashPassword = ", hashPassword)
        const authenticated = bcrypt.compare(password, hashPassword);
            if(!authenticated) { 
                res.status(401).json({message: "Email and Password do not match. Please try again."})
                return
            }
            sequelize.query(
                `SELECT email, user_id, first_name FROM users
                WHERE email = ?
                AND password = '${hashPassword}'`,
                {
                    replacements: [email],
                    type: QueryTypes.INSERT
                }
            )
        .then(dbres => {
            let [[dbObj]] = dbres;
            const {email, user_id, first_name} = dbObj;
            let user = {
                email: email,
                user_id: user_id,
                first_name: first_name
            }
            const token = jwt.sign(user, ACCESS_TOKEN_SECRET);
            res.cookie('accessToken', `'${token}'`, { maxAge: 60*60*8 });
            res.status(200).json({ message: "Successful login.", token: `${token}`});
        })
        .catch((error) => {
            console.log(error);
            res.status(403).json({ message: "Error retrieving information" });
        });
    },

    logout: (req, res) => {
        res.clearCookie('accessToken');
        return res.status(200).json( 'Logout successful.');
    }
}