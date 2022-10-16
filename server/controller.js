require('dotenv').config();
const bcrypt = require("bcryptjs");

const Sequelize = require('sequelize');
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
        let userObj = {
          first_name: `${first_name}`,
          last_name: `${last_name}`,
          email: `${email}`,
          street_address: `${street_address}`,
          city: `${city}`,
          state: `${state}`,
          password: hashPassword
        }
        console.log('Registering User');
        // console.table(userObj);
        sequelize.query(`
        INSERT INTO users(first_name, last_name, email, street_address, city, state, password)
        VALUES (${userObj.first_name}, ${userObj.last_name}, ${userObj.email}, ${userObj.street}, ${userObj.city}, ${userObj.state}, ${hashPassword});
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {console.log(err)})
        // delete userObj.password;
        // console.table(userObj);
        // res.status(200).send(userObj);
    },

    getUpcomingAppointments: (req, res) => {

    },

    getPastAppointments: (req, res) => {

    },

    seed: (req, res) => {
        sequelize.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(75) NOT NULL,
                street_address VARCHAR(300) NOT NULL,
                city VARCHAR(75) NOT NULL,
                state VARCHAR(50) NOT NULL,
                password BINARY(100) NOT NULL
            );
        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    }
};