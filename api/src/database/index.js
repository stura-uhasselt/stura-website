const mongoose = require('mongoose');

function setup(user, pass, host, database) {
    const uri = `mongodb+srv://${user}:${pass}@${host}/${database}?retryWrites=true`;
    
    mongoose.connect(uri, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    mongoose.connection.on('error', console.log);
    mongoose.connection.once('open', () => console.log('open'));
}

module.exports = {
    setup,
    mongoose,
    Signatures: require('./models/signatures'),
    Users: require('./models/users'),
};     
