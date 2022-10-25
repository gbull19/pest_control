require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const {SERVER_PORT} = process.env;

const {
    // getUpcomingAppointments,
    // getPastAppointments,
    login,
    register,
    seed
} = require('./controller.js')

app.get("/", (req, res) => {
    res.render("../public/login.html");
});
// app.get('/upcoming', getUpcomingAppointments);
// app.get('/appt', getPastAppointments);
app.post('/api/login', login);
app.post('/api/register', register);
app.post('/api/seed', seed);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));