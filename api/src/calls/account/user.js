const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../../database');
const google = require('../../utils/google');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('./.certs/private.pem', 'utf8');

module.exports = express.Router()
    // .use((req, res, next) => {
    //     if (!req.auth) return res.errors.needAuth();
    //     next();
    // })
    .get('/', async (req, res) => {
        res.jsons(req.auth.user.beautify());
    })
    .post('/', async (req, res) => {
        // if (! await req.auth.user.hasPermissions('ADMIN') && ! await req.auth.user.hasPermissions('BOARD'))
        //     return res.errors.custom('Need to be admin or in the board');
            
        const data = req.body;
        const password = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

        const user = new db.Users({
            name: data.name,
            lastname: data.lastname,
            email: data.email,
            password,
        });

        try {
            await user.save();
            res.jsons(user);

            verificationMail(user);
        } catch (e) {
            res.errors.db(e);
        }
    })
    .put('/', async (req, res) => {
        const data = req.body;

        if (!req.auth) return res.errors.needAuth();

        try {
            if (data.password && data.password_new) 
                return updatePassword(req, res);
        } catch(e) {
            res.errors.db(e);
        }

        return res.errors.incomplete();
    });

async function verificationMail(user) {
    const token = jwt.sign({
        id: user._id,
        hash: await bcrypt.hash(user.password, 10),
        db_id: 0,
        exp: Math.floor(Date.now() / 1000) + 10*24*60*60,
    }, privateKey, {algorithm: 'RS256'});

    google.sendMail({
        subject: 'StuRa | Choose a password',
        receiver_name: user.name + ' ' + user.lastname,
        receiver_email: user.email,
        content: `Welcome to StuRa, <a href="https://${process.env.HOST}/intern/recovery?token=${token}">choose a password</a>`,
    });
}

async function updatePassword(req, res) {
    const data = req.body;
    const user = req.auth.user;

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) return res.errors.wrongCredentials();

    user.password = await bcrypt.hash(data.password_new, 10);
    await user.save();
    
    res.jsons(user.beautify());


    google.sendMail({
        subject: 'StuRa | Password changed',
        receiver_name: user.name + ' ' + user.lastname,
        receiver_email: user.email,
        text: 'Your password got changed.',
    });
}

