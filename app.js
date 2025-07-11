const express = require('express');
const apiRoutes = require('./routes/api.routes');

const app = express();

app.use(express.json());

app.use('/', apiRoutes);

// Global error handling
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;