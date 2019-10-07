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
        const result = await createRecursive('top', data.parent, data.pageSize, data.pageToken);
        res.json(result);
    });

async function createRecursive(name='top', parent, pageSize, pageToken) {
    const response = {
        name,
        files: [],
        folders: [],
        parent,
    };

    const result = await drive.listFiles(parent, pageSize, pageToken);
    response.pageToken = result.nextPageToken;

    for (const file of result.files) {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
            const folder =  await createRecursive(file.name, file.id, 5, undefined);
            response.folders.push(folder);
        } else {
            response.files.push(file);
        }
    }

    return response;
}


