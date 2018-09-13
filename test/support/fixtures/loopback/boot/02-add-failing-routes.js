const MicroserviceError = require('../../../../../src/MicroserviceError');

module.exports = (app) => {
    app.get('/error/withservicetrace', (req, res, next) => {
        const msg = 'You called the endpoint exposing an erro with an existing trace and serviceName';
        const error = new MicroserviceError(msg, {
            serviceName: 'remote-test-service',
            serviceTrace: ['remote-test-service'],
        });
        next(error);
    });
};
