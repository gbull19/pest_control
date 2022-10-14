require('dotenv').config();

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
    getUpcomingAppointments: (req, res) => {

    },

    getPastAppointments: (req, res) => {

    }
};