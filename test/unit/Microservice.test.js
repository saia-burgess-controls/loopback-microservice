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
        const bootOptions = {
            appRootDir: './test',
            appConfigRootDir: './test/config',
            componentRootDir: './test/config',
            dsRootDir: '/app/config',
            env: 'test',
            middlewareRootDir: '/test/config',
            modelsRootDir: '/test/config',
        };
        const service = new Microservice(app, bootOptions);

        expect(service.bootOptions).to.deep.equal(bootOptions);
    });

    it('accepts boot options that contain a property serviceName (which is not part of loopbacks' +
        'boot options) and sets it as its name accessible via corresponding getters', function(){
        const app = new MockApp();
        const bootOptions = {
            appRootDir: './test',
            appConfigRootDir: './test/config',
            componentRootDir: './test/config',
            dsRootDir: '/app/config',
            env: 'test',
            middlewareRootDir: '/test/config',
            modelsRootDir: '/test/config',
            serviceName: 'test-service',
        };
        const service = new Microservice(app, bootOptions);

        expect(service.bootOptions).to.deep.equal(bootOptions);
        expect(service.getName()).to.be.equal('test-service');
    });
});
