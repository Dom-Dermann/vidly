const winston = require('winston');
require('express-async-errors');

module.exports = function () {

    winston.add(winston.transports.File, { filename: 'logfile.log' });
    
    process.on('uncaughtException', (ex) => {
        winston.transports.Console( {colorize: true, prettyPrint: true});
        winston.error(ex.message, ex);
        process.exit(1);
    });
    
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });
}