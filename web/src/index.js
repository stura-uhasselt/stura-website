const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const compression = require('compression');
const cookie = require('cookie');

app.disable('x-powered-by');

app.set('view engine', 'ejs');

app.use(compression());
app.use(express.static(path.resolve('www')));
app.use(express.static(path.resolve('public'), {
    maxage: '3h',
    setHeaders: (res) => {
        res.setHeader('Expires', new Date(Date.now() + 1000*60*60*3).toUTCString());
    }
}));

app.use((req, res, next) => {
    if (!req.headers.cookie) {
        req.cookies = {};
        return next();
    }
    req.cookies = cookie.parse(req.headers.cookie);
    next();
});

app.use(require('./render'));

app.listen(port, () => console.log(`frontend app listening on ${process.env.HOST}:${port}!`));
