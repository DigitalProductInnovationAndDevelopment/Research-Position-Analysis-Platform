require('dotenv').config();


const express = require('express');
const path = require('path');
const publicationsRoutes = require('./routes/publications');
const cors = require('cors');
const topicsRoutes = require('./routes/topics');
const institutionsRoutes = require('./routes/institutions');
const autocompleteRoutes = require('./routes/autocomplete');

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


// routes
app.use('/api/publications', publicationsRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/institutions', institutionsRoutes);
app.use('/autocomplete', autocompleteRoutes);

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});