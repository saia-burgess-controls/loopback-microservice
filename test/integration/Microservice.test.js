const path = require('path');

const { expect } = require('chai');

const Microservice = require('../../src/Microservice');

describe('The Microservice', function() {

    before('boot a service', async function(){
        const appRootDir = path.resolve(__dirname, '../support/fixtures/loopback');
        this.ms = await Microservice.boot({appRootDir});
    });

    it('is properly booted exposing models', function(){
        expect(this.ms.app)
            .to.have.property('models')
            .that.has.property('Test');
    });


    it('can be started, returning a promise which resolves the service ' +
        '(returns the running instance if already started)', async function() {
        const service = await this.ms.start();
        expect(this.ms).to.equal(service);
    });

    it('exposes an api client if started', async function(){
        const service = await this.ms.start();
        expect(service)
            .to.have.property('api')
            .that.has.property('base')
            .that.equals('http://0.0.0.0:3333/api');
    });

    it('the api client allows querying the api', async function(){
        const service = await this.ms.start();
        const response = await service.api
            .get('/tests')
            .set('accept', 'application/json')
            .then((response) => response);
        expect(response).to.have.property('status', 200);
    });

    it('can be stopped, returning a promise which resolves the service', async function() {
        const service = await this.ms.start();
        const stopped = await service.stop();

        expect(this.ms).to.equal(stopped);
    });

    after('stop the service', function(){
        return this.ms.stop();
    });

});
