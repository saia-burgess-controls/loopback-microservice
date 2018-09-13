const MicroserviceError = require('../MicroserviceError');

module.exports = {
    watchGlobal(variableName, setter) {
        if (typeof setter === 'function') {
            Object.defineProperty(global, variableName, { set: setter });
        } else {
            Object.defineProperty(global, variableName, {
                set: (value) => {
                    throw new MicroserviceError(`Global variable "${variableName}" was set!`);
                },
            });
        }
    },
};
