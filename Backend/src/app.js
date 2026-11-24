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
app.use('/api/cubicles', require('./routes/cubicleRoutes'));
app.use('/api/computer-lab', require('./routes/computerLabRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));


module.exports = app;
