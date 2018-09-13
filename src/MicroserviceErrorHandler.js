const strongErrorHandler = require('strong-error-handler');

const MicroserviceError = require('./MicroserviceError');


module.exports = class MicroserviceErrorHandler {

    constructor(options, { delegateHandler = strongErrorHandler } = {}) {
        const fields = ['errorCode', 'serviceName', 'serviceTrace'];
        const opts = this._copyAndAddSafeFields(options, fields);

        this.serviceName = this.extractServiceName(opts);
        this.handler = delegateHandler(opts);
    }

    extractServiceName(options) {
        const serviceName = options.serviceName || (options.microservice || {}).name;
        if (serviceName) {
            return serviceName;
        }

        const msg = 'Configuration value for @joinbox/loopback-microservice#errorHandler' +
            ' is missing: Please add the property "serviceName" to the "params" section of the' +
            ' middleware config or copy your general microservice config (containing the name)' +
            // eslint-disable-next-line no-template-curly-in-string
            ' by adding "microservice": "${microservice}"';
        throw new MicroserviceError(msg);
    }

    _copyAndAddSafeFields(options, fields = []) {
        const originalSafeFields = Array.isArray(options.safeFields) ? options.safeFields : [];
        const safeFields = originalSafeFields.concat(fields);
        // assign all properties and override the safeFields with the newly allocated array
        return Object.assign({}, options, { safeFields });
    }

    createErrorHandler() {
        return (err, req, res, next) => {
            // prevent the service from overriding errors from remote services
            if (!err.serviceName) {
                // eslint-disable-next-line no-param-reassign
                err.serviceName = this.serviceName;
            }

            // store the names of the services the error has gone through
            if (!Array.isArray(err.serviceTrace)) {
                // eslint-disable-next-line no-param-reassign
                err.serviceTrace = [];
            }

            err.serviceTrace.push(this.serviceName);
            return this.handler.call(null, err, req, res, next);
        };
    }
};
