const fs = require('fs').promises;
const {google} = require('googleapis');

const SCOPES = [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file',
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
    auth: oAuth2Client
});

oAuth2Client.on('tokens', async (tokens) => {
    if (tokens.refresh_token) {
        await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
        console.log('token stored', TOKEN_PATH);
    }
});

async function setup() {
    try {
        const token = await fs.readFile(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
    } catch(e) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize', authUrl);
    }
}

async function auth(code) {
    const {tokens} = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
}

module.exports = {
    setup,
    auth,
    drive,
    gmail,
};
