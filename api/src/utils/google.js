const fs = require('fs').promises;
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
];

const redirect_uris = [
    'urn:ietf:wg:oauth:2.0:oob',
    'http://localhost'
];

const TOKEN_PATH = './.certs/token.json';

const oAuth2Client = new google.auth.OAuth2(
    process.env.G_CLIENT_ID,
    process.env.G_CLIENT_SECRET,
    redirect_uris[0],
);

const drive = google.drive({
    version: 'v3', 
    auth: oAuth2Client
});

const gmail = google.gmail({
    version: 'v1',
    auth: oAuth2Client,
});

oAuth2Client.on('tokens', async (tokens) => {
    if (tokens.refresh_token) {
        await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
        console.log('token stored', TOKEN_PATH);
    }
});

async function setup() {
    const token = await fs.readFile(TOKEN_PATH).catch(() => {
        return getAccessToken(oAuth2Client);
    });
    oAuth2Client.setCredentials(JSON.parse(token));
}

async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        ouput: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question('code:', async (code) => {
            rl.close();
            const {tokens} = await oAuth2Client.getToken(code);

            resolve(JSON.stringify(tokens));
        });
    });
}

async function listFiles(query) {
    const files = await drive.files.list({
        corpora: 'allDrives',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        pageSize: 5,
        pageToken: query.next,
        orderBy: 'name desc',
        q: '"1Mtjv5-PvQHKfcmP19fV_M5f1XcSa209-" in parents',
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

async function sendMail(object) {
    const subject = object.subject;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        'From: StuRa NoReply <studentenraad@student.uhasselt.be>',
        `To: ${object.receiver_name} <${object.receiver_email}>`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        object.content,
    ];
    const message = messageParts.join('\n');
  
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  
    const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });
    console.log(res.data);
    return res.data;
}

module.exports = {
    setup,
    listFiles,
    getFile,
    getFileInfo,
    sendMail,
};