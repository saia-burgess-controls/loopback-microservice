const strongErrorHandler = require('strong-error-handler');

const MicroserviceError = require('./MicroserviceError');


module.exports = class MicroserviceErrorHandler {

    constructor(options, {delegateHandler = strongErrorHandler} = {}){
        const fields = [ 'errorCode', 'serviceName' ];
        const opts = this._copyAndAddSafeFields(options, fields);

        this.serviceName = this.extractServiceName(opts);
        this.handler = delegateHandler(opts);
    }

    extractServiceName(options) {
        const serviceName = options.serviceName || (options.microservice || {}).name;
        if(!serviceName) {
            const msg = 'Configuration value for @joinbox/loopback-microservice#errorHandler' +
                ' is missing: Please add the property "serviceName" to the "params" section of the' +
                ' middleware config or copy your general microservice config (containing the name)'
            ' by adding "microservice": "${microservice}"';
            throw new MicroserviceError(msg);
        }
        return serviceName;
    }

    _copyAndAddSafeFields(options, fields) {
        const opts = Object.assign({}, options);
        if(!Array.isArray(opts.safeFields)){
            opts.safeFields = fields;
        } else {
            opts.safeFields.push(...fields);
        }
        return opts;
    }

    createErrorHandler() {
        return (err, req, res, next) => {
            err.serviceName = this.serviceName;
            return this.handler.call(null, err, req, res, next);
        };
    }
}