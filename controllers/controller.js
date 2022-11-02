require('dotenv').config();
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const atob = require('atob');
const { cookie, clearCookie } = require("cookie-parser");
const {ACCESS_TOKEN_SECRET} = process.env;
const {Sequelize, OP, QueryTypes} = require("sequelize");
const path = require('path')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = {
    getHTML: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html' ))
    },
    getCSS: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.css'))
    },
    getJS: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.js'))
    },
    getMyAccountJS: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/myaccount.js'))
    },
    getDashCSS: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/dashboard.css'))
    },
    getDashJS: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/dashboard.js'))
    },
    getContactJS: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/contactus.js'))
    },

    // getUpcomingAppointments: (req, res) => {
    // },

    newContactForm: (req, res) => {
        const { first_name, last_name, phone, email, message } = req.body;
        console.log("req.body = ", req.body);
        sequelize.query(`
            INSERT INTO message (first_name, last_name, phone, email, message)
            VALUES (?, ?, ?, ?, ?);`,
            {
                replacements: [first_name, last_name, phone, email, message],
                type: QueryTypes.INSERT
            }
        )
        .then(dbRes => {
            console.log("deRes successful");
            res.status(200).json({ message: 'Message received' });
        })
        .catch(err => {
            console.log(err);
            res.status(401).json({ message: 'Error recording message' });
        })
    },

    newApptRequest: async (req, res) => {
        const { first_name, pest_name } = req.body;
        let [[userAddressID]] = await sequelize.query(`
            SELECT user_address_id FROM user_address
            WHERE user_id = 2;
        `)
        userAddressID = userAddressID.user_address_id;
        let [[pestID]] = await sequelize.query(`
            SELECT pest_id FROM pests
            WHERE pest_name = ?;`,
            {
                replacements: [pest_name],
                type: QueryTypes.INSERT  
            }
        )
        pestID = pestID.pest_id
        await sequelize.query(`
            INSERT INTO requests (first_name, user_id, user_address_id, pest_id)
                VALUES (?, ?, ?, ?);`,
            {
                replacements: [first_name, '2', userAddressID, pestID],
                type: QueryTypes.INSERT
            }
        )
        .then(dbres => {
            res.status(200).json({ message: 'Request received' });
        })
        .catch((error) => {
            console.log(error);
            res.status(403).json({ message: 'Error recording request' });
        });
    },
        
    getAllAppts: (req, res) => {
        let token = req.headers.cookie;
        token = token.split("=")[1].replace(/['"]+/g, '');
        // add token verification to load the dashboard page, else log message "Please login before viewing dashbaord"
        let authenticated = jwt.verify(token, ACCESS_TOKEN_SECRET);
        if (!authenticated) {
            return res.status(401).json({ message: "Please login before accessing the dashboard"});
        }
        const { user_id } = authenticated;
        sequelize.query(
            `SELECT u.first_name, ua.street_address, ua.city, ua.state, a.appt_date, a.interior, a.appt_price, p.pest_name
            FROM users u
                JOIN user_address ua ON ua.user_id = u.user_id
                JOIN appts a ON a.user_id = u.user_id
                JOIN appt_pests ap ON ap.appt_id = a.appt_id
                JOIN pests p ON p.pest_id = ap.pest_id
            WHERE u.user_id = '${user_id}';`
        )
        .then(dbres => {
            let [dbObj] = dbres;
            console.log(dbObj)
            res.status(200).json({ dbObj });
        })
        .catch((error) => {
            console.log(error);
            res.status(403).json({ message: "Error retrieving information"});
        });
    },

    seed: (req, res) => {
        sequelize.query(`
            DROP TABLE IF EXISTS message;
            DROP TABLE IF EXISTS requests;
            DROP TABLE IF EXISTS appt_pests;
            DROP TABLE IF EXISTS pests;
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

            CREATE TABLE pests (
                pest_id SERIAL,
                pest_name VARCHAR(40) NOT NULL,
                PRIMARY KEY (pest_id)
            );

            CREATE TABLE appt_pests (
                appt_pests_id SERIAL,
                appt_id INTEGER NOT NULL,
                pest_id INTEGER NOT NULL,
                PRIMARY KEY (appt_pests_id),
                CONSTRAINT fk_appt_id FOREIGN KEY (appt_id) REFERENCES appts(appt_id),
                CONSTRAINT fk_pest_id FOREIGN KEY (pest_id) REFERENCES pests(pest_id)
            );

            CREATE TABLE requests (
                request_id SERIAL,
                first_name VARCHAR(40) NOT NULL,
                user_id INTEGER NOT NULL,
                user_address_id INTEGER NOT NULL,
                pest_id INTEGER NOT NULL,
                PRIMARY KEY (request_id),
                CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
                CONSTRAINT fk_user_address_id FOREIGN KEY (user_address_id) REFERENCES user_address(user_address_id),
                CONSTRAINT fk_pest_id FOREIGN KEY (pest_id) REFERENCES pests(pest_id)
            );

            CREATE TABLE message (
                message_id SERIAL,
                first_name VARCHAR(40) NOT NULL,
                last_name VARCHAR(40) NOT NULL,
                phone VARCHAR(10) NOT NULL,
                email VARCHAR(75) NOT NULL,
                message VARCHAR(800) NOT NULL,
                PRIMARY KEY (message_id)
            );

            INSERT INTO users (first_name, last_name, email, password, is_tech)
            VALUES ('Garrett', 'Bull', 'garrett@bull.com', '$2a$10$S6zbkDxnW97kHuhEng8uZu3DZHrOUsGmtr9edMiNa148p43ePBeou', TRUE),
            ('Tony', 'Stark', 'tony@starkent.com', '$2a$10$n.qwi1yUq65UHeS9Pb6Jq.2k2faZvT5rxD1bK8TeykAHW/9sWYykG', FALSE);

            INSERT INTO user_address (street_address, city, state, user_id)
            VALUES ('123 N 456 W', 'Orem', 'Utah', '1'),
            ('10880 Malibu Point', 'Malibu', 'Utah', '2');

            INSERT INTO pests (pest_name)
            VALUES ('Ants'),
            ('Cockroaches'),
            ('Earwigs'),
            ('Spiders'),
            ('Wasps');

            INSERT INTO appts (appt_date, interior, appt_price, user_id, user_address_id)
            VALUES ('2021-07-21', '1', '150', '2', '2'),
            ('2021-10-20', '1', '150', '2', '2'),
            ('2022-02-28', '1', '300', '2', '2'),
            ('2022-05-19', '1', '250', '2', '2'),
            ('2022-07-26', '1', '150', '2', '2'),
            ('2022-10-01', '1', '150', '2', '2');

            INSERT INTO appt_pests (appt_id, pest_id)
            VALUES ('1', '3'),
            ('2', '1'),
            ('3', '2'),
            ('4', '3'),
            ('5', '5'),
            ('6', '1');

            INSERT INTO requests (first_name, user_id, user_address_id, pest_id)
            VALUES ('Pepper', '2', '2', '4');

            INSERT INTO message (first_name, last_name, phone, email, message)
            VALUES ('Scott', 'Lang', '1234567890', 'scott@lang.com', 'I need help getting rid of some spiders. They are huge and I''m afraid they will eat me.');

        `).then(() => {
            console.log('DB seeded')
            res.status(200)
        }).catch(err => console.log('Error seeding DB', err))
    }
};