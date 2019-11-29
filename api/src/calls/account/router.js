const express = require('express');
module.exports =  express.Router()
    .use('/setup', require('./setup'));
