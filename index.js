const errorHandler = require('./src/errorHandler.js');
const LoopbackModelBase = require('./src/LoopbackModelBase.js');
const Microservice = require('./src/Microservice.js');
const MicroserviceApiClient = require('./src/MicroserviceApiClient.js');
const MicroserviceError = require('./src/MicroserviceError.js');
const testing = require('./src/testing');

module.exports = Microservice;

module.exports.Error = MicroserviceError;
module.exports.errorHandler = errorHandler;

module.exports.MicroserviceError = MicroserviceError;
module.exports.LoopbackModelBase = LoopbackModelBase;
module.exports.MicroserviceApiClient = MicroserviceApiClient;
module.exports.testing = testing;
