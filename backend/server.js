require('dotenv').config();

const express = require('express');
const publicationsRoutes = require('./routes/publications');
const topicsRoutes = require('./routes/topics');

// express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


// routes
app.use('/api/publications', publicationsRoutes);
app.use('/api/topics', topicsRoutes);

// listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});