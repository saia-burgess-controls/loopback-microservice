const path = require('path');

const { expect } = require('chai');
const loopback = require('loopback');

const Microservice = require('../../src/Microservice');
const appRootDir = path.resolve(__dirname, '../support/fixtures/loopback');

describe('The Microservice', function() {

    before('boot a service', async function(){
        const boot = { appRootDir };
        this.ms = await Microservice.boot({boot});
    });


    it('can be directly started from a static method taking options as a parameter', async function(){
        const boot = { appRootDir };
        const ms = await Microservice.start({ boot });
        try {
            expect(ms).to.be.an.instanceOf(Microservice);
            await ms.stop();
        } catch (err) {
            // make sure the microservice is properly shut down
            await ms.stop();
            // throw the assertions
            throw err;
        }
    });

    it('boots the loopback app', function(){
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
            .that.equals('http://0.0.0.0:3333/api/');
    });

    it('the api client allows querying the api', async function(){

        const service = await this.ms.start();
        const response = await service
            .api
            .get('/tests')
            .set('accept', 'application/json');

        expect(response).to.have.property('status', 200);
    });

    it('exposes an error handler which enriches the error with the serviceName ' +
        'if configured accordingly', async function(){

        const service = await this.ms.start();
        try {
            await service
                .api
                .get('/nonExisting')
                .set('accept', 'application/json');
            return Promise.reject(new Error('Request to non existing route should fail.'))
        } catch ({response}) {
            const {body} = response;
            expect(body.error).to.have.property('serviceName', 'test-service');
        }
    });

    it('can be stopped, returning a promise which resolves the service', async function() {
        const service = await this.ms.start();
        const stopped = await service.stop();

        expect(this.ms).to.be.equal(stopped);
    });

    it('logs data on startup', async function() {

        const logger = this.ms.getLogger();

        await this.ms.stop();

        logger.reset();

        await this.ms.start();

        expect(logger.logs.info).to.have.length(1);
    });

    it('exposes the correct service name, as soon as the app is booted ("Microservice" per default)',
        async function(){
            const app = loopback();
            const options = {
                boot: {
                    appRootDir,
                },
            };
            const ms = new Microservice(app, options);
            expect(ms.getName()).to.be.equal('Microservice');

            await ms.boot();

            // configured in the `config.json`
            expect(ms.getName()).to.be.equal('test-service');
        },
    );

    after('stop the service', function(){
        return this.ms.stop();
    });

});
