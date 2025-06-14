require('dotenv').config();

const express = require('express');
const publicationsRoutes = require('./routes/publications');
const cors = require('cors');

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

// listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});