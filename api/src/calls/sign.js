const express = require('express');
const db = require('../database');

module.exports = express.Router({mergeParams: true})
    .post('/', async (req, res) => {
        const {email, project, ...meta} = req.body;

        try {
            const signature = await db.Signatures.create({
                email,
                project,
                meta,
            });

            res.json({
                success: true,
                signature,
            });
        } catch(e) {
            res.json({
                success: false,
                e,
            });
        }
    });
