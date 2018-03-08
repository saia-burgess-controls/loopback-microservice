const MicroserviceError = require('@joinbox/loopback-microservice');

module.exports = class LoopbackModelBase {
    constructor({ modelName, model }) {
        if (!modelName) {
            throw LoopbackModelBase.createError(`No modelName was given to the
                LoopbackModelBase constructor`);
        }
        if (!model) {
            throw LoopbackModelBase.createError(`No Loopback Model Instance was given to the
                LoopbackModelBase constructor`);
        }

        this.modelName = modelName;
        this[this.modelName] = model;
    }

    /**
     * register loopback hooks with async functions
     * @param  {String} hook            name of the loopback hook
     * @param  {String} method          loopback method to hook in
     * @param  {Function} hookFunction  hook callback
     * @return void
     */
    registerHook(hook, method, hookFunction) {
        this[this.modelName][hook](method, (...params) => {
            const next = params.pop();

            hookFunction.apply(this, params).then((stop) => {
                if (!stop) {
                    next();
                }
            }).catch(next);
        });
    }

    /**
     * Get the loopback environment
     * @return {String} Environment variable
     */
    getEnv() {
        if (!this.appEnv) {
            if (!this[this.modelName].app) {
                throw this.createError(`The loopback application environment could
                    not be loaded becaus the application was not initalized yet.`);
            }

            this.appEnv = this[this.modelName].app.get('env');
        }

        return this.appEnv;
    }

    /**
     * Create a custom error
     * @param  {String} message error message
     * @return {Error}          loopback error
     */
    static createError(message) {
        return new MicroserviceError(message);
    }
};
