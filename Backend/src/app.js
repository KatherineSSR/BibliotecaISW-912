const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/access', require('./routes/accessRoutes'));


module.exports = app;
