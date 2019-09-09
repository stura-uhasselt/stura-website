const express = require('express');
const Url = require('url');

const languages = {
    en: require('./languages/en'),
    nl: require('./languages/nl')
};

module.exports =  express.Router()
    .get('*', (req, res) => {
        const url = Url.parse(req.url).pathname;
        const options = renderOptions(req);

        res.render(`pages${url}`, options);
    })
    .use((err, req, res, next) => {
        const options = renderOptions(req);

        res.status(404).render('pages/index', options);
    });

function renderOptions(req) {
    let language = 'nl';
    let source = 'default';

    if (req.cookies._language) {
        language = req.cookies._language;
        source = 'cookies';
    } else if (req.acceptsLanguages('nl', 'en')) {
        language = req.acceptsLanguages('nl', 'en');
        source = 'useragent';
    }

    return {
        text: languages[language],
        language,
        source,
    };
}
