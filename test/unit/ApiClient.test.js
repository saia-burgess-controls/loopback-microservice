const { expect } = require('chai');

const ApiClient = require('../../src/MicroserviceApiClient');

const httpVerbs = ['GET', 'PUT', 'POST', 'PATCH', 'OPTIONS', 'DELETE'];

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

    const requestLibrary = getRequestMock(httpVerbs);
    const baseUrl = 'http://test.com:3333';
    const testPath = '/testing/'
    const client = new ApiClient(baseUrl, {requestLibrary});

    httpVerbs.forEach((method) => {
        const methodName = method.toLowerCase();
        it(`provides a method for ${method} requests`, async function(){
            const method = client[methodName];

            expect(method).to.be.a('function');

            await method.call(client, testPath);

            const { calls } = requestLibrary;

            expect(calls).to.have.property(methodName).that.has.length(1);

            const call = calls[methodName][0];

            expect(call).to.have.property('path', 'http://test.com:3333/testing/');
        });
    });
});

function getRequestMock(verbs = []){
    const mock = {
        calls: {},
        _countInvocation(method, path, data){
            if(!Array.isArray(mock.calls[method])){
                mock.calls[method] = [];
            }
            mock.calls[method].push({
                path,
                data,
            });
            return {
                status: 200,
                body: {},
            };
        }
    };
    // create methods for each http verb
    verbs.forEach((verb) => {
        const lowerVerb = verb.toLowerCase();
        mock[lowerVerb] = async (path, data) => {
            return mock._countInvocation(lowerVerb, path, data);
        };
    })
    return mock;
}
