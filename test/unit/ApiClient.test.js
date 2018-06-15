const { expect } = require('chai');

const ApiClient = require('../../src/MicroserviceApiClient');

describe('The ApiClient Class', function(){

    it('can be instantiated with a base url and exposes the used request library ' +
        '(superagent by default)', function(){
        const baseUrl = 'http://test.com:3333/';
        const client = new ApiClient(baseUrl);
        expect(client).to.have.property('base', baseUrl);
        expect(client).to.have.property('request').that.is.ok;
    });

    it('accepts a requestLibrary as part of the constructor options and normalizes the base url', function(){
        const baseUrl = 'http://test.com:3333';
        const options = { requestLibrary: {}};
        const client = new ApiClient(baseUrl, options);
        expect(client).to.have.property('base', `${baseUrl}/`);
        expect(client).to.have.property('request', options.requestLibrary);
    });

    it('can be created from a parsed url using a factory function', function(){
        const hostname = 'test.com';
        const port = 3333;
        const protocol = 'https';

        const client = ApiClient.fromURL({hostname, port, protocol});

        expect(client).to.have.property('base', `${protocol}://${hostname}:${port}/`);
    });

    it('can be created from a parsed url using a factory function ' +
        '(also accepting the options object)', function(){
        const hostname = 'test.com';
        const port = 3333;
        const protocol = 'https';
        const options = { requestLibrary: {}};

        const client = ApiClient.fromURL({hostname, port, protocol}, options);

        expect(client).to.have.property('base', `${protocol}://${hostname}:${port}/`);
        expect(client).to.have.property('request', options.requestLibrary);
    });

    it('appends paths to the base url', function(){
        const baseUrl = 'http://test.com:3333';
        const client = new ApiClient(baseUrl);
        const fullUrl = client.createEndpoint('/tests/');

        expect(fullUrl).to.equal('http://test.com:3333/tests/');
    });

    it('normalizes urls with leading separator', function(){
        const baseUrl = 'http://test.com:3333/';
        const client = new ApiClient(baseUrl);
        const fullUrl = client.createEndpoint('/tests/');

        expect(fullUrl).to.equal('http://test.com:3333/tests/');
    });

    it('normalizes urls with a base path', function(){
        const baseUrl = 'http://test.com:3333/api/';
        const client = new ApiClient(baseUrl);
        const fullUrl = client.createEndpoint('/tests/');

        expect(fullUrl).to.equal('http://test.com:3333/api/tests/');
    });

    it('normalizes urls without leading separator', function(){
        const baseUrl = 'http://test.com:3333';
        const client = new ApiClient(baseUrl);
        const fullUrl = client.createEndpoint('tests/');

        expect(fullUrl).to.equal('http://test.com:3333/tests/');
    });



    const methods = ['GET', 'PUT', 'POST', 'PATCH', 'OPTIONS', 'DELETE'];

    methods.forEach((method) => {
        const lowerMethod = method.toLowerCase();
        it(`provides a method for ${method} requests`, function(){
            const baseUrl = 'http://test.com:3333';
            const client = new ApiClient(baseUrl);

            expect(client).to.have.property(lowerMethod).that.is.a('function');
        });
    });
});
