module.exports = class MockLogger {
    constructor(){
        const levels = {
            ERROR: 'error',
            LOG: 'log',
            INFO: 'info',
            WARN: 'warn',
        };
        this.logs = this._emptyLogs(levels);
        this.levels = levels;
    }

    error(message) {
        return this._log(this.levels.ERROR, message);
    }

    info(message) {
        return this._log(this.levels.INFO, message);
    }

    log(message){
        return this._log(this.levels.LOG, message);
    }

    warn(message) {
        return this._log(this.levels.WARN, message);
    }

    reset() {
        this.logs = this._emptyLogs(this.levels);
    }

    _log(level, message) {
        this.logs[level].push(message);
    }

    _emptyLogs(levels) {
        return Object
            .values(levels)
            .reduce((logs, level) => {
                logs[level] = [];
                return logs;
            }, {});
    }

}