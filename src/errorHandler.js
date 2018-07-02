const MicroserviceErrorHandler = require('./MicroserviceErrorHandler');

module.exports = function(options) {
    const handler = new MicroserviceErrorHandler(options);
    return handler.createErrorHandler();
};
