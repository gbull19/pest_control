require('dotenv').config();
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const {Sequelize, DataTypes} = require("sequelize");
// const db = require('_helpers/db');

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = {
    register: (req, res) => {
        const {first_name, last_name, email, street_address, city, state, is_tech, password} = req.body;
        const hashPassword = bcrypt.hashSync(password, salt);
        sequelize.query(`
            WITH ins AS (
                INSERT INTO users (first_name, last_name, email, password, is_tech)
                VALUES ('${first_name}', '${last_name}', '${email}', '${hashPassword}', '0')
                RETURNING user_id
            )
            INSERT INTO user_address (street_address, city, state, user_id)
            VALUES ('${street_address}', '${city}', '${state}', (SELECT user_id FROM ins));
        `)
        .then(() => {
            console.log('Registration complete')
            res.sendStatus(200)
        }).catch(err => 
            console.log('Error seeding DB', err),
            res.status(400)
        );
    },

    login: (req, res) => {
        // console.log(req.body);
        const {email, password} = req.body;
    //     for (let i = 0; i < users.length; i++) {
    //         if (users[i].email === email) {
    //          const authenticated = bcrypt.compareSync(password, users[i].        password)
    //           if (authenticated) {
    //             let userToReturn = {...users[i]}
    //             // delete userToReturn.password
    //             res.status(200).send(userToReturn)
    //           }
    //         }
    //     }res.status(401).send("User not found.")
    // },
        axios.get(process.env.CONNECTION_STRING, {
            auth: {
                email,
                password
            }
        })
        .then(({data}) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
    },

    getUpcomingAppointments: (req, res) => {

    },

    getPastAppointments: (req, res) => {

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
                user_id INTEGER NOT NULL,
                PRIMARY KEY (appt_id),
                CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id)
                );

            CREATE TABLE appt_pests (
                appt_pests_id SERIAL,
                pest_01 VARCHAR(40) NOT NULL,
                pest_02 VARCHAR(40),
                pest_03 VARCHAR(40),
                pest_04 VARCHAR(40),
                pest_05 VARCHAR(40),
                appt_id INTEGER NOT NULL,
                PRIMARY KEY (appt_pests_id),
                CONSTRAINT fk_appt_id FOREIGN KEY (appt_id) REFERENCES appts(appt_id)
            );         

            INSERT INTO users (first_name, last_name, email, password, is_tech)
            VALUES ('Garrett', 'Bull', 'garrett@bull.com', 'NoMorePests1!', '1'),
            ('Tony', 'Stark', 'tony@starkent.com', '1LuvPepper!', '0');

            INSERT INTO user_address (street_address, city, state, user_id)
            VALUES ('123 N 456 W', 'Orem', 'Utah', '1'),
            ('10880 Malibu Point', 'Malibu', 'Utah', '2');

            INSERT INTO appts (appt_date, interior, user_id)
            VALUES ('2022-10-01', '1', '2');

            INSERT INTO appt_pests (pest_01, appt_id)
            VALUES ('Spiders', '1');
        `).then(() => {
            console.log('DB seeded')
            res.sendStatus(200)
        }).catch(err => console.log('Error seeding DB', err))
    }
};