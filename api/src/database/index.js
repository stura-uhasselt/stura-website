const mongoose = require('mongoose');

function setup(user, pass, host, database) {
    const uri = `mongodb+srv://${user}:${pass}@${host}/${database}?retryWrites=true&w=majority`;
    mongoose.set('useCreateIndex', true);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    mongoose.connection.on('error', console.log);
    mongoose.connection.once('open', () => console.log('open'));
}

module.exports = {
    setup,
    mongoose,
    Users: require('./models/users'),
    Logs: require('./models/logs.js'),
};     
