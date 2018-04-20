const { expect } = require('chai');

const Microservice = require('../../src/Microservice');
const MicroserviceError = require('../../src/MicroserviceError');

const MockApp = require('../support/MockApp');

describe('The Microservice Class', function(){

    it('exposes a custom error class for typed error handling', function(){
        expect(Microservice).to.have.property('Error', MicroserviceError);
    });

    it('exposes a custom error class for typed error handling as MicroserviceError to avoid collisions ' +
        'with the default Node Error when accessed using destructuring', function(){
        expect(Microservice).to.have.property('MicroserviceError', MicroserviceError);
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

});
