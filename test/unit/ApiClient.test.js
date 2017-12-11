const { expect } = require('chai');

const ApiClient = require('../../src/MicroserviceApiClient');

describe('The ApiClient Class', function(){

    it('can be instantiated with a base url', function(){
        const baseUrl = 'http://test.com:3333';
        const client = new ApiClient(baseUrl);
        expect(client).to.have.property('base', baseUrl);
    });

    it('can be created from a parsed url using a factory function', function(){
        const hostname = 'test.com';
        const port = 3333;
        const protocol = 'https';

        const client = ApiClient.fromURL({hostname, port, protocol});

        expect(client).to.have.property('base', `${protocol}://${hostname}:${port}`);
    });

    it('appends paths to the base url', function(){
        const baseUrl = 'http://test.com:3333';
        const client = new ApiClient(baseUrl);
        const fullUrl = client.createEndpoint('/tests/');

        expect(fullUrl).to.equal('http://test.com:3333/tests/');
    });

});
