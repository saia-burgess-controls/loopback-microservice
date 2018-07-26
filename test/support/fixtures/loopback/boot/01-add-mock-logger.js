const MockLogger = require('../MockLogger');

module.exports = async function(app) {
    app.set('microservice-logger', new MockLogger());
};