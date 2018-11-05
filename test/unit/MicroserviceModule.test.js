const microserviceModule = require('../../index.js');

const { expect } = require('chai');
const { describe, it } = require('mocha');

describe('The LoopbackMicroservice package', () => {

    it('exposes the MicroserviceApiClient class', () => {
        expect(microserviceModule)
            .to.have.property('MicroserviceApiClient')
            .that.is.a('function');
    });

    it('exposes the Microservice class', () => {
        expect(microserviceModule).to.be.a('function');
    });

    it('exposes the MicroserviceError class', () => {
        expect(microserviceModule)
            .to.have.property('MicroserviceError')
            .that.is.a('function');
    });

});
