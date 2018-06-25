const { expect } = require('chai');

const ApiClient = require('../../src/MicroserviceApiClient');

const httpVerbs = ['GET', 'PUT', 'POST', 'PATCH', 'OPTIONS', 'DELETE'];

describe('The ApiClient Class', () => {

    it('can be instantiated with a base url and exposes the used request library ' +
        '(superagent by default)', () => {
        const baseUrl = 'http://test.com:3333/';
        const client = new ApiClient(baseUrl);
        expect(client).to.have.property('base', baseUrl);
        expect(client).to.have.property('request').that.is.ok;
    });

    it('accepts a requestLibrary as part of the constructor options and normalizes the base url', () => {
        const baseUrl = 'http://test.com:3333';
        const options = { requestLibrary: {} };
        const client = new ApiClient(baseUrl, options);
        expect(client).to.have.property('base', `${baseUrl}/`);
        expect(client).to.have.property('request', options.requestLibrary);
    });

    it('can be created from a parsed url using a factory function', () => {
        const hostname = 'test.com';
        const port = 3333;
        const protocol = 'https';

        const client = ApiClient.fromURL({ hostname, port, protocol });

        expect(client).to.have.property('base', `${protocol}://${hostname}:${port}/`);
    });

    it('can be created from a parsed url using a factory function ' +
        '(also accepting the options object)', () => {
        const hostname = 'test.com';
        const port = 3333;
        const protocol = 'https';
        const options = { requestLibrary: {} };

        const client = ApiClient.fromURL({ hostname, port, protocol }, options);

        expect(client).to.have.property('base', `${protocol}://${hostname}:${port}/`);
        expect(client).to.have.property('request', options.requestLibrary);
    });

    it('appends paths to the base url', () => {
        const baseUrl = 'http://test.com:3333';
        const client = new ApiClient(baseUrl);
        const fullUrl = client.createEndpoint('/tests/');

        expect(fullUrl).to.equal('http://test.com:3333/tests/');
    });

    it('normalizes urls with leading separator', () => {
        const baseUrl = 'http://test.com:3333/';
        const client = new ApiClient(baseUrl);
        const fullUrl = client.createEndpoint('/tests/');

        expect(fullUrl).to.equal('http://test.com:3333/tests/');
    });

    it('normalizes urls with a base path', () => {
        const baseUrl = 'http://test.com:3333/api/';
        const client = new ApiClient(baseUrl);
        const fullUrl = client.createEndpoint('/tests/');

        expect(fullUrl).to.equal('http://test.com:3333/api/tests/');
    });

    it('normalizes urls without leading separator', () => {
        const baseUrl = 'http://test.com:3333';
        const client = new ApiClient(baseUrl);
        const fullUrl = client.createEndpoint('tests/');

        expect(fullUrl).to.equal('http://test.com:3333/tests/');
    });

    describe('ApiClient.normalizeBaseUrl(baseUrl = "", separator="/")', () => {

        const client = new ApiClient('');

        it('appends a separator to an url if not present', () => {
            const url = client.normalizeBaseUrl('http://test.com:22');
            expect(url).to.be.equal('http://test.com:22/');
        });

        it('does not append a separator to an url if present', () => {
            const url = client.normalizeBaseUrl('http://test.com:22/');
            expect(url).to.be.equal('http://test.com:22/');
        });

        it('appends a custom separator', () => {
            const url = client.normalizeBaseUrl('http://test.com:22', '?');
            expect(url).to.be.equal('http://test.com:22?');
        });

        it('ignores a custom separator if present', () => {
            const url = client.normalizeBaseUrl('http://test.com:22', '2');
            expect(url).to.be.equal('http://test.com:22');
        });
    });

    describe('ApiClient.normalizeUrlPath(path = "", separator="/")', () => {

        const client = new ApiClient('');

        it('removes a separator from a path if present', () => {
            const url = client.normalizeUrlPath('/test/');
            expect(url).to.be.equal('test/');
        });

        it('does not modify the path if the seaparator is not present', () => {
            const url = client.normalizeUrlPath('test/');
            expect(url).to.be.equal('test/');
        });

        it('removes a custom separator', () => {
            const url = client.normalizeUrlPath('?test/', '?t');
            expect(url).to.be.equal('est/');
        });

        it('ignores a custom separator if not present', () => {
            const url = client.normalizeUrlPath('test', '\\');
            expect(url).to.be.equal('test');
        });
    });

    const requestLibrary = getRequestMock(httpVerbs);
    const baseUrl = 'http://test.com:3333';
    const testPath = '/testing/';
    const client = new ApiClient(baseUrl, { requestLibrary });

    httpVerbs.forEach((method) => {
        const methodName = method.toLowerCase();
        it(`provides a method for ${method} requests`, async() => {
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

function getRequestMock(verbs = []) {
    const mock = {
        calls: {},
        _countInvocation(method, path, data) {
            if (!Array.isArray(mock.calls[method])) {
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
        },
    };
    // create methods for each http verb
    verbs.forEach((verb) => {
        const lowerVerb = verb.toLowerCase();
        mock[lowerVerb] = async(path, data) => mock._countInvocation(lowerVerb, path, data);
    });
    return mock;
}
