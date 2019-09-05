const express = require('express');

module.exports = express.Router({mergeParams: true})
    .get('/', async (req, res) => {
        let language = 'nl';
        let source = 'default';

        console.log(req.cookies._language);

        if (req.cookies._language) {
            language = req.cookies._language;
            source = 'cookies';
        } else if (req.acceptsLanguages('nl', 'en')) {
            language = req.acceptsLanguages('nl', 'en');
            source = 'useragent';
        } 

        res.json({
            language,
            source,
        });

    })
    .post('/', async (req, res) => {
        const data = req.body;

        if (!data.language) return res.json({
            success: false,
            reason: 'not a supported language',
        });

        console.log(data.language);

        res.cookie('_language',data.language, {
            maxAge: 10*365*24*3600*1000,
            secure: true,
            domain: '.sturauhasselt.be',
        });

        res.json({
            success: true,
            language: data.language,
        });
    })
    .delete('/', async (_req, res) => {
        res.clearCookie('_language', {
            domain: '.sturauhasselt.be',
            secure: true,
        });

        res.json({
            success: true,
        });
    });

