const express = require('express');
// const google = require('../../utils/google');

module.exports = express.Router({mergeParams: true})
    .get('/', async (req, res) => {
        return res.json({success: false});
        // if (!req.query.code) return res.json({success: false});

        // try {
        //     await google.auth(req.query.code);
        //     res.json({
        //         success: true,
        //     });
        // } catch(e) {
        //     res.json({
        //         success: false,
        //         e
        //     });
        // }
    });
