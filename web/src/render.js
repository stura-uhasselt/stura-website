const express = require('express');
const Url = require('url');

const languages = {
    en: require('./languages/en'),
    nl: require('./languages/nl')
};

console.log(languages);

module.exports =  express.Router()
    .get('*', (req, res) => {
        const url = Url.parse(req.url).pathname;
        const options = renderOptions(req);

        console.log(options);

        res.render(`pages${url}`, options);
    })
    .use((err, req, res) => {
        res.status(404).render('pages/notfound');
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

    console.log(language, source);

    return {
        text: languages[language],
        language,
        source,
    };
}
