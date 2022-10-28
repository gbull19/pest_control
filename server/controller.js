require('dotenv').config();
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET} = process.env;
const atob = require("atob");
const {Sequelize, OP, QueryTypes} = require("sequelize");
const appts = require('../public/appts')
const {renderDisplayCard, makeApptDisplayCard, getPastAppts} = appts

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
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

    loadDash: (req, res) => {
        const token = req.body.token;
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_","/");
        const tokenData = JSON.parse(atob(base64));
        const {email, user_id} = tokenData;
        sequelize.query(`
            SELECT * FROM appts 
            WHERE user_id = '${user_id}';
        `)
        .then(dbres =>{
            const appts = dbres[0]
            res.status(200).json({message: 'loadDash successful', email, user_id, appts});
        })
        .catch(err => {
            console.log(err);
            res.status(403).json({message: 'error running loadDash'});
        });
    },

    authenticateToken: async (req, res, next) => {
        const token = req.body.token;
        // const authHeader = req.headers["authorization"]
        // const token = authHeader && authHeader.split(' ')[1] //returns last truthy value
        if (!token) return res.status(401)
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET)
        if (!decoded) return res.status(401)
        next()
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
        const authenticated = bcrypt.compareSync(password, hashPassword);
            if(!authenticated) { 
                res.status(401).json({message: "Email and Password do not match. Please try again."})
                return
            }
            sequelize.query(
                `SELECT email, user_id FROM users
                WHERE email = ?
                AND password = '${hashPassword}'`,
                {
                    replacements: [email],
                    type: QueryTypes.INSERT
                }
                )
        .then(dbres => {
            let [[dbObj]] = dbres;
            const {email, user_id} = dbObj;
            let user = {
                email: email,
                user_id: user_id
            }
            const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET)
            res.status(200).json({ accessToken: accessToken})
        })
        .catch((error) => {
            console.log(error);
            res.status(403).json({ message: "Error retrieving information"});
        });
    },

    getUpcomingAppointments: (req, res) => {

    },

    getAllAppts: (req, res) => {
        sequelize.query(`
            SELECT * 
            FROM users u
            JOIN appts a ON u.user_id = '2' AND a.user_id = '2'; 
        `)
        .then(dbres => {
            let [dbObj] = dbres;
            console.log(dbObj);
            dbObj = delete dbObj.password
            res.status(200).json({ dbObj})
        })
        .catch((error) => {
            console.log(error);
            res.status(403).json({ message: "Error retrieving information"});
        });
    },

    seed: (req, res) => {
        sequelize.query(`
            DROP TABLE IF EXISTS appt_pests;
            DROP TABLE IF EXISTS appts;
            DROP TABLE IF EXISTS user_address;
            DROP TABLE IF EXISTS users;


            CREATE TABLE users (
                user_id SERIAL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(75) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                is_tech BOOLEAN NOT NULL,
                PRIMARY KEY (user_id)
            );     
            
            CREATE TABLE user_address (
                user_address_id SERIAL,
                street_address VARCHAR(300) NOT NULL,
                city VARCHAR(75) NOT NULL,
                state VARCHAR(50) NOT NULL,
                user_id INTEGER NOT NULL,
                PRIMARY KEY (user_address_id),
                CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) 
            );

            CREATE TABLE appts (
                appt_id SERIAL,
                appt_date DATE NOT NULL,
                interior BOOLEAN NOT NULL,
                appt_price DECIMAL NOT NULL,
                user_id INTEGER NOT NULL,
                user_address_id INTEGER NOT NULL,
                PRIMARY KEY (appt_id),
                CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
                CONSTRAINT fk_user_address_id FOREIGN KEY (user_address_id) REFERENCES user_address(user_address_id)
            );

            CREATE TABLE appt_pests (
                appt_pests_id SERIAL,
                pest_01 VARCHAR(40) NOT NULL,
                pest_02 VARCHAR(40),
                appt_id INTEGER NOT NULL,
                PRIMARY KEY (appt_pests_id),
                CONSTRAINT fk_appt_id FOREIGN KEY (appt_id) REFERENCES appts(appt_id)
            );

            INSERT INTO users (first_name, last_name, email, password, is_tech)
            VALUES ('Garrett', 'Bull', 'garrett@bull.com', '$2a$10$S6zbkDxnW97kHuhEng8uZu3DZHrOUsGmtr9edMiNa148p43ePBeou', '1'),
            ('Tony', 'Stark', 'tony@starkent.com', '$2a$10$n.qwi1yUq65UHeS9Pb6Jq.2k2faZvT5rxD1bK8TeykAHW/9sWYykG', '0');

            INSERT INTO user_address (street_address, city, state, user_id)
            VALUES ('123 N 456 W', 'Orem', 'Utah', '1'),
            ('10880 Malibu Point', 'Malibu', 'Utah', '2');

            INSERT INTO appts (appt_date, interior, appt_price, user_id, user_address_id)
            VALUES ('2022-07-26', '1', '100', '2', '2'),
            ('2022-10-01', '1', '100', '2', '2');

            INSERT INTO appt_pests (pest_01, appt_id)
            VALUES ('Spiders', '1'),
            ('Spiders', '2');
        `).then(() => {
            console.log('DB seeded')
            res.status(200)
        }).catch(err => console.log('Error seeding DB', err))
    }
};