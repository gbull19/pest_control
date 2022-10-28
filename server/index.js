require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const {SERVER_PORT} = process.env;

const {
    // getUpcomingAppointments,
    getAllAppts,
    login,
    register,
    seed,
    authenticateToken,
    loadDash
} = require('./controller.js')

// app.get('/upcoming', getUpcomingAppointments);
// app.get('/appt', getPastAppointments);
app.get('/api/getallappts', getAllAppts)
app.post('/dashboard', authenticateToken, loadDash);
app.post('/api/login', login);
app.post('/api/register', register);
app.post('/api/seed', seed);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));