require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const {SERVER_PORT} = process.env;

const {
    getUpcomingAppointments,
    getPastAppointments, 
} = require('./controller.js')

app.get('/upcoming', getUpcomingAppointments);
app.get('/appt', getPastAppointments);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));