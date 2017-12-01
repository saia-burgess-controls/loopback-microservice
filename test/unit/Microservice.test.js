const { expect } = require('chai');

const Microservice = require('../../src/Microservice');

const MockApp = require('../support/MockApp');

describe('The Microservice Class', function(){

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
