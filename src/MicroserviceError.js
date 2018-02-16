module.exports = class MicroserviceError extends Error {

    constructor(message, data = {}){
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        Object.assign(this, data);
    }

};