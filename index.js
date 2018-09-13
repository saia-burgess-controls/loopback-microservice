const errorHandler = require('./src/errorHandler');
const LoopbackModelBase = require('./src/LoopbackModelBase');
const Microservice = require('./src/Microservice');
const MicroserviceError = require('./src/MicroserviceError');
const testing = require('./src/testing');

module.exports = Microservice;

module.exports.Error = MicroserviceError;
module.exports.errorHandler = errorHandler;

module.exports.MicroserviceError = MicroserviceError;
module.exports.LoopbackModelBase = LoopbackModelBase;
module.exports.testing = testing;
