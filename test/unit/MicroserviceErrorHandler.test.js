const { expect } = require('chai');

const MicroserviceErrorHandler = require('../../src/MicroserviceErrorHandler');

describe('The MicroserviceErrorHandler class', function(){
    it('can be instantiated with options containing the serviceName', function(){
        const serviceName = 'unit-test-service';
        const handler = new MicroserviceErrorHandler({ serviceName });

        expect(handler).to.have.property('serviceName', serviceName);
    });

    it('can be instantiated with options containing the microservice config object', function(){
        const microservice = {
            name: 'unit-test-service',
        };
        const handler = new MicroserviceErrorHandler({ microservice });
        expect(handler).to.have.property('serviceName', microservice.name);
    });

    it('throws and error if it cannot extract a service name (there is no reason to use it otherwise' +
        ' at this time', function(){
        expect(() => new MicroserviceErrorHandler({})).to.throw();
    });

    it('accepts an additional options object containing a delegateHandler (for testing) which ' +
        'creates the middleware to delegate to', function(){
        const serviceName = 'unit-test-service';
        const delegate = () => {};
        const delegateHandler = (options) => delegate;
        const handler = new MicroserviceErrorHandler({ serviceName }, {delegateHandler});

        expect(handler).to.have.property('handler', delegate);
    });

    it('modifys and adapts the options passed to the needs of the strong error handler, ' +
        'especially the safeFields to prevent the handler from stripping out data', function(){
        const opts = {
            serviceName: 'unit-test',
            log: false,
            debug: true,
        };
        const delegateHandler = (options) => {
            expect(options).to.have.property('log', false);
            expect(options).to.have.property('debug', true);
            expect(options).to.have.property('safeFields').that.deep.equals([
                'errorCode',
                'serviceName',
            ]);
        };

        new MicroserviceErrorHandler(opts, {delegateHandler});
    });

    it('appends safe fields to existing configuration', function(){
        const opts = {
            serviceName: 'unit-test',
            safeFields: [
                'testField',
            ],
        };
        const delegateHandler = (options) => {
            expect(options).to.have.property('safeFields').that.deep.equals([
                'testField',
                'errorCode',
                'serviceName',
            ]);
        };

        new MicroserviceErrorHandler(opts, {delegateHandler});
    });

    it('exposes a method which creates the corresponding middleware', function(){
        const opts = {
            serviceName: 'unit-test',
            safeFields: [
                'testField',
            ],
        };
        const delegate = (err, req, res, next) => {};
        const delegateHandler = (options) => {
            return delegate;
        };

        const handler = new MicroserviceErrorHandler(opts, {delegateHandler});
        const middleware = handler.createErrorHandler();

        expect(middleware).to.be.a('function');
    });
});