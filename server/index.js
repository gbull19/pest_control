require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(cookieParser());

const PORT = process.env.PORT || 8444

const {getHTML, getCSS, getJS, getDashCSS, getDashJS, getMyAccountJS, getContactJS } = require('../controllers/controller.js')
app.get('/', getHTML)
app.get('/css', getCSS)
app.get('/js', getJS)
app.get('/contactJS', getContactJS)
app.get('/myaccountJS', getMyAccountJS)
app.get('/dashCSS', getDashCSS)
app.get('/dashJS', getDashJS)

const { privateRoutes } = require('./private.js');
const { register, login, logout } = require("../controllers/auth.js");
const { getAllAppts, newApptRequest, newContactForm, seed } = require('../controllers/controller.js');
const { checkAuth } = require('../middlewares/checkAuth.js')

// app.get('/upcoming', getUpcomingAppointments);
app.get('/private', checkAuth, privateRoutes);
app.get('/api/appts', getAllAppts);
app.get('/api/logout', logout);
app.post('/api/contact', newContactForm)
app.post('/api/apptrequest', newApptRequest);
app.post('/api/login', login);
app.post('/api/register', register);
app.post('/api/seed', seed);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));