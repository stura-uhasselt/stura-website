const express = require('express');
const db = require('../database');
const gmail = require('../utils/gmail');

module.exports = express.Router({mergeParams: true})
    .get('/confirm', async (req, res) => {
        const url = `https://${process.env.HOST}/mobiliteit`;

        if (!req.query.id) return res.redirect(url);

        try {
            const signature = await db.Signatures.findById(req.query.id);
            if (!signature) return res.redirect(url);

            signature.confirmed = true;
            await signature.save();

            return res.redirect(url + '?success');
        } catch(e) {
            res.redirect(url);
        }
    })
    .get('/', async(req, res) => {
        try {
            const count = await db.Signatures.countDocuments({
                confirmed: true
            });
            res.json({success: true, count});
        } catch(e) {
            res.json({success: false, e});
        }
    })
    .post('/', async (req, res) => {
        const {email, project, ...meta} = req.body;

        try {
            const signature = await db.Signatures.create({
                email,
                project,
                meta,
            });

            await gmail.send(
                'StuRa: Bevestig handtekening mobiliteitsplan',
                email,
                '',
                [
                    'Wauw, super dat je ons mobiliteitsplan tekent! Bevestig je handtekening nog snel hier:<br>',
                    `<a href="https://api.${process.env.HOST}/sign/confirm?id=${signature._id}">Bevestig handtekening</a><br>`,
                    '<br>',
                    '<br>',
                    `<small>Werkt de knop niet? Kopieer deze link in je browser: https://api.${process.env.HOST}/sign/confirm?id=${signature._id}</small>`
                ]
            );

            res.json({
                success: true,
                email: signature.email,
            });
        } catch(e) {
            console.log(email, e);
            res.json({
                success: false,
            });
        }
    });
