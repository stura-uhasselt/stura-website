const express = require('express');
module.exports =  express.Router()
    .use((req, res, next) => {
        req.computed = {};
        next();
    })
    .use('/language', require('./language'))
    .use('/documents', require('./documents'))
    .all('*', (req, res) => {
        res.status(404).json({
            reason: 'api call not found',
        });
    });
