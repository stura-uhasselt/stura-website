const { gmail } = require('./google');

async function send(subject, to, name, content) {
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        'From: StuRa UHasselt <stura@uhasselt.be>',
        `To: ${name} <${to}>`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        ...content,
    ];
    const message = messageParts.join('\n');
  
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
    send,
};
