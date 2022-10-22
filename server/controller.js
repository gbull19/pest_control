require('dotenv').config();
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");

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
        const {first_name, last_name, email, street_address, city, state, password} = req.body
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        sequelize.query(`
        INSERT INTO users (first_name, last_name, email, street_address, city, state, password)
        VALUES ('${first_name}', '${last_name}', '${email}', '${street_address}', '${city}', '${state}', '${hashPassword}');
        `)
        .then(() => {
            console.log('Registration complete')
            res.sendStatus(200)
        }).catch(err => console.log('Error seeding DB', err))
    },

    login: (req, res) => {

    },

    getUpcomingAppointments: (req, res) => {

    },

    getPastAppointments: (req, res) => {

    },

    seed: (req, res) => {
        sequelize.query(`
            DROP TABLE IF EXISTS users;

            CREATE TABLE users (
                user_id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(75) NOT NULL,
                street_address VARCHAR(300) NOT NULL,
                city VARCHAR(75) NOT NULL,
                state VARCHAR(50) NOT NULL,
                is_tech BIT, 
                password VARCHAR(100) NOT NULL
            );

            INSERT INTO users (first_name, last_name, email, street_address, city, state, is_tech, password)
            VALUES ('Garrett', 'Bull', 'garrett@bull.com', '123 W 456 N', 'Orem', 'Utah', '1', '123456');
        `).then(() => {
            console.log('DB seeded')
            res.sendStatus(200)
        }).catch(err => console.log('Error seeding DB', err))
    }
};