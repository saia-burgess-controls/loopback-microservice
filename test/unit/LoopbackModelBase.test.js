const { expect } = require('chai');

const LoopbackModelBase = require('../../src/LoopbackModelBase');

const MockApp = require('../support/MockApp');

describe('The LoopbackModelBase Class', function() {
    it('throws an error if no model is given', function(){
        try {
            new LoopbackModelBase({ });
        } catch (error) {
            expect(error).to.have.property('message', 'No Loopback Model Instance was given to the\n                LoopbackModelBase constructor');
        }
    });

    it('creates an instance with the given values', function(){
        const instance = new LoopbackModelBase({ model: {}, modelName: 'test' });

        expect(instance).to.have.property('modelName', 'test');
    });

    it('throws an error when calling get env without loopback booted', function(){
        const instance = new LoopbackModelBase({ model: {}, modelName: 'test' });
        let env;
        try {
            evn = instance.getEnv();
        } catch (error) {
            expect(error).to.have.property('message', '\n                    The loopback application environment could\n                    not be loaded because the application was not initalized yet.\n                    Therefore not app object is avalialble.\n                    Usualy this means you need to call the looback boot function');
        }

        expect(env).to.equals(undefined);
    });

    it('createError returns an error ', function(){
        const error = LoopbackModelBase.createError('test error');

        expect(error).to.have.property('message', 'test error');
    });

    it('getPrototypeFunctionsRecursive returns all functions of the prototype chain', function(){
        const instance = new LoopbackModelBase({ model: {}, modelName: 'test' });
        class TestClass  {
            testFunction() {}
        }
        const functions = instance.getPrototypeFunctionsRecursive(new TestClass());
        
        expect(functions.has('testFunction')).to.equals(true);
    });

});
