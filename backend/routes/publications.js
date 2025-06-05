const express = require('express');
const router = express.Router();

//get all publications
router.get('/', (req, res) => {
    res.json({ message: 'get all publications' });
})

//get a single publication
router.get('/:id', (req, res) => {
    res.json({ message: 'get a single publication' });
})

//post a new publication
router.post('/', (req, res) => {
    res.json({ message: 'post a new publication' });
})

//delete a publication
router.delete('/:id', (req, res) => {
    res.json({ message: 'delete a publication' });
})

//update a publication
router.patch('/:id', (req, res) => {
    res.json({ message: 'update a publication' });
})







module.exports = router;
