const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Sample API for restaurants (can be expanded)
const restaurantsData = require('./data.json'); // We'll convert data.js to JSON later or just serve it

app.get('/api/restaurants', (req, res) => {
    res.json(restaurantsData);
});

// Serve index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
