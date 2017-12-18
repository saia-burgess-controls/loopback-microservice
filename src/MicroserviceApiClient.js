const superagent = require('superagent');
const url = require('url');

module.exports = class MicroserviceApiClient {

    constructor(baseUrl, {requestLibrary = superagent} = {}) {
        this.base = baseUrl;
        this.request = requestLibrary;
    }

    get(path) {
        return this.request.get(this.createEndpoint(path));
    }

    post(path, data) {
        return this.request.post(this.createEndpoint(path), data);
    }

    put(path, data) {
        return this.request.put(this.createEndpoint(path), data);
    }

    patch(path, data) {
        return this.request.patch(this.createEndpoint(path), data);
    }

    options(path){
        return this.request.options(this.createEndpoint(path));
    }

    delete(path, data) {
        return this.request.delete(this.createEndpoint(path), data);
    }

    createEndpoint(path) {
        return `${this.base}${path}`;
    }

    static fromURL(urlOptions, options = {}) {
        const urlTemplate = Object.assign({}, urlOptions);
        urlTemplate.protocol = urlTemplate.protocol || 'http';

        return new MicroserviceApiClient(url.format(urlTemplate), options);
    }

};
