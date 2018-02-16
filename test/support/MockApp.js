module.exports = class MockApp {
    constructor(options) {
        this.storage = Object.assign({}, options);
    }

    get(key) {
        return this.storage[key];
    }

    set(key, value) {
        this.storage[key] = value;
    }
};
