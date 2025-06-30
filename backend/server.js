require('dotenv').config();


const express = require('express');
const publicationsRoutes = require('./routes/publications');
const cors = require('cors');
const topicsRoutes = require('./routes/topics');
const institutionsRoutes = require('./routes/institutions');

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


// routes
app.use('/api/publications', publicationsRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/institutions', institutionsRoutes);

// listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});