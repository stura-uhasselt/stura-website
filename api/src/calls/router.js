const express = require('express');
module.exports =  express.Router()
    .use((req, res, next) => {
        req.computed = {};
        next();
    })
    .use('/account', require('./account/router'))
    .use('/language', require('./language'))
    .use('/reports', require('./reports'))
    .all('*', (req, res) => {
        res.status(404).json({
            reason: 'api call not found',
        });
    });
