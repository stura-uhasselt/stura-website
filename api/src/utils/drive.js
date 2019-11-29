const { drive } = require('./google');

async function listFiles(parent='118PRmD81epxBEp6DeNfSQI9GxxdQ2r-p', pageSize, pageToken) {
    const files = await drive.files.list({
        corpora: 'allDrives',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        pageSize,
        pageToken,
        orderBy: 'name desc',
        q: `"${parent}" in parents`,
    });
    return files.data;
}

function getFile(fileId, dest) {
    drive.files.get({
        fileId,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        alt: 'media'
    }, {responseType: 'stream'}, function(err, res){
        res.data
            .on('end', () => {
            })
            .on('error', err => {
                console.log('Error', err);
            })
            .pipe(dest);
    });
}

function getFileInfo(fileId) {
    return drive.files.get({
        fileId,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        fields: ['name']
    });
}

module.exports = {
    listFiles,
    getFile,
    getFileInfo,
};
