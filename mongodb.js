const mongoose = require('mongoose');
const config = require('./config');
mongoose.Promise = global.Promise;

exports.mongoose = mongoose;

exports.connect = () => {
    mongoose.connect(config.dbConnection);

    mongoose.connection.once('open', function callback() {
        console.log('connect mongodb successfully');
    });

    mongoose.connection.on('error', function (error) {
        console.log('fail to connect mongodb', error);
    });

    return mongoose;
};
