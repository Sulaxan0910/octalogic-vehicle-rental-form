const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // your React app URL and port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());
app.use('/api', bookingRoutes);

module.exports = app;
