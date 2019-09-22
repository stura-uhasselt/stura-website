const express = require('express');


module.exports = express.Router({mergeParams: true})
    .get('/', async (req, res) => {
        res.json({});
    });


