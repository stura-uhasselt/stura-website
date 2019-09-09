const express = require('express');
const drive = require('../utils/drive');

drive.setup();

module.exports = express.Router({mergeParams: true})
    .get('/:id', async (req, res) => {
        const file = await drive.getFileInfo(req.params.id);
        res.set('content-disposition', `attachment; filename="${file.data.name}"`);
        drive.getFile(req.params.id, res);
    })
    .get('/', async (req, res) => {
        const data = req.query;
        const reports = await drive.listFiles(data);
        res.json(reports);
    })


