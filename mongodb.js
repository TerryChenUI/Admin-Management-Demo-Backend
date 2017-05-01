const mongoose = require('mongoose');
const setting = require('./config/setting.js');

exports.mongoose = mongoose;

exports.connect = () => {
    mongoose.Promise = global.Promise;
    
    mongoose.connect(setting.dbConnection);

    mongoose.connection.once('open', function callback() {
        console.log('connect mongodb successfully');
    });

    mongoose.connection.on('error', function (error) {
        console.log(error);
    });
    
    return mongoose;
};
