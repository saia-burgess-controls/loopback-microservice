const { promisify } = require('util');

const boot = require('loopback-boot');
const loopback = require('loopback');

const MicroserviceApiClient = require('./MicroserviceApiClient');
const MicroserviceError = require('./MicroserviceError');
const LoopbackModelBase = require('./LoopbackModelBase');
const errorHandler = require('./errorHandler');

/**
 * Basic Microservice class wrapping a loopback application.
 *
 * @type {module.Microservice}
 */
module.exports = class Microservice {

    constructor(app, options = {}) {
        // for backwards compatibility
        const bootOptions = Object.prototype.hasOwnProperty.call(options, 'boot')
            ? Object.assign({}, options.boot)
            : Object.assign({}, options);

        this.app = app;
        this.config = Object.assign({}, this.constructor.getConfig(app), options);
        this.name = this.constructor.getServiceName(app);

        this.server = null;
        this.api = null;

        this.bootOptions = bootOptions;
    }

    getName(){
        return this.name;
    }

    isRunning() {
        return (this.server && this.server.listening);
    }

    /**
     * Stop the webserver of the microservice.
     *
     * @returns {Promise.<Microservice>}
     */
    async stop() {

        if (!this.isRunning()) {
            return this;
        } else {
            const server = this.server;
            // avoid race conditions
            this.server = null;
            return new Promise((resolve, reject) => {
                // does not work with promisify
                server.close((error) => {
                    if (error) {
                        // if unable to stop the server, reassign it.
                        this.server = server;
                        reject(error);
                    } else {
                        resolve(this);
                    }
                });
            });
        }
    }

    /**
     * Start the webserver of the microservice.
     *
     * @returns {Promise.<Microservice>}
     */
    async start() {

        if (this.isRunning()){
            return this;
        } else {
            return new Promise((resolve) => {
                // @note: this method might throw an exception, we should not catch it,
                //        due to possible issues in the testing
                this.server = this.app.listen(() => {

                    this.app.emit('started');

                    const baseUrl = this.app.get('url').replace(/\/$/, '');
                    const explorer = this.app.get('loopback-component-explorer');
                    const logger = this.getLogger();

                    if (logger) {
                        logger.info('Web server listening at: %s', baseUrl);
                        if (explorer) {
                            const explorerPath = explorer.mountPath;
                            logger.info('Browse your REST API at %s%s', baseUrl, explorerPath);
                        }
                    }
                    this.api = this.setupApiClient(this.app);
                    resolve(this);
                });
            });
        }

    }

    setupApiClient(app){
        const options = {
            hostname: app.get('host'),
            port: app.get('port'),
            pathname: app.get('restApiRoot'),
        };
        return MicroserviceApiClient.fromURL(options);
    }

    getLogger() {
        return this.app.get('microservice-logger');
    }

    /**
     * Boots the application.
     *
     * More information on the options can be found here https://apidocs.strongloop.com/loopback-boot/.
     *
     * @todo: Do we need to protect the app from being booted multiple times?
     *
     * @see Microservice
     *
     * @param options
     * @returns {Promise.<Microservice>}
     */
    async boot() {
        return promisify(boot)(this.app, this.bootOptions).then(() => this);
    }

    /**
     * Boots a microservice instance and starts the webserver.
     *
     * @returns {Promise.<Microservice>}
     */
    static async start(options = {}) {
        const service = await Microservice.boot(options);
        return service.start();
    }

    /**
     * Creates a microservice instance and boots the corresponding loopback application
     * without listening to an interface.
     *
     * The options argument is optional and is bound to the microservice instance
     * (so every boot process would use the given options).
     *
     * @see the boot method on the class
     *
     * @param options
     * @returns {Promise.<Microservice>}
     */
    static async boot(options = {}) {
        const app = loopback();
        return (new Microservice(app, options)).boot();
    }

    static getConfig(app, key, fallback) {
        const config = app.get('microservice') || {};
        if(key){
            return config[key] || fallback;
        } else {
            return config;
        }
    }

    static getServiceName(app, fallback = 'Microservice'){
        return this.getConfig(app, 'name', fallback);
    }
};

module.exports.Error = MicroserviceError;
module.exports.MicroserviceError = MicroserviceError;
module.exports.LoopbackModelBase = LoopbackModelBase;
module.exports.errorHandler = errorHandler;
