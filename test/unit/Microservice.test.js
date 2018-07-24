const { expect } = require('chai');

const Microservice = require('../../src/Microservice');
const MicroserviceError = require('../../src/MicroserviceError');
const LoopbackModelBase = require('../../src/LoopbackModelBase');

const MockApp = require('../support/MockApp');

describe('The Microservice Class', function(){

    it('exposes "Error", a base class for typed error handling', function(){
        expect(Microservice).to.have.property('Error', MicroserviceError);
    });

    it('exposes "MicroserviceError", the base class for typed error handling (to avoid collisions ' +
        'with the default Node Error when accessed using destructuring)', function(){
        expect(Microservice).to.have.property('MicroserviceError', MicroserviceError);
    });

    it('exposes "LoopbackModelBase", a class that can be used to extend loopback models', function(){
        expect(Microservice).to.have.property('LoopbackModelBase', LoopbackModelBase);
    });

    it('can be instantiated with an app instance which is exposed', function(){
        const app = new MockApp();
        const service = new Microservice(app);

        expect(service).to.have.property('app', app);
    });

    it('accepts boot options', function(){
        const app = new MockApp();
        const boot = {
            appRootDir: './test',
            appConfigRootDir: './test/config',
            componentRootDir: './test/config',
            dsRootDir: '/app/config',
            env: 'test',
            middlewareRootDir: '/test/config',
            modelsRootDir: '/test/config',
        };
        const service = new Microservice(app,  { boot });

        expect(service.bootOptions).to.deep.equal(boot);
    });

    it('takes configuration values from the app using the "microservice" key', function(){
        const microservice = {
            name: 'test-service',
        };
        const app = new MockApp({microservice});
        const service = new Microservice(app, {});

        expect(service.getName()).to.be.equal('test-service');
    });

    it('the options object can have a boot section for future use', function(){
        const microservice = {
            name: 'test-service',
        };
        const options = {
            boot: {
                appRootDir: './test',
            },
        };
        const app = new MockApp({microservice});
        const service = new Microservice(app, options);

        expect(service.bootOptions).to.be.deep.equal(options.boot);
    });

    it('allows injecting a logger via app using the default key "microservice-logger"', function() {
        const microservice = {};
        const logger = {};
        const app = new MockApp({
            'microservice-logger': logger,
            microservice,
        });
        const service = new Microservice(app, {});
        expect(service.getLogger()).to.be.equal(logger);
    });

    it('allows setting the logger key using the "microservice.logger" configuration', function() {
        const microservice = {
            logger: 'myLogger',
        };
        const myLogger = {};
        const app = new MockApp({
            myLogger,
            microservice,
        });
        const service = new Microservice(app, {});
        expect(service.getLogger()).to.be.equal(myLogger);
    })
});
