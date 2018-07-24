const MockLogger = require('../MockLogger');

module.exports = async function(app, options) {
    app.set('microservice-logger', new MockLogger());
};