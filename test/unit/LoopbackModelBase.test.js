const { expect } = require('chai');

const LoopbackModelBase = require('../../src/LoopbackModelBase');

const MockApp = require('../support/MockApp');

describe('The LoopbackModelBase Class', function() {
    it('throws an error if no model is given', function(){
        const msg = 'No Loopback model instance was given to the LoopbackModelBase constructor';
        expect(() => new LoopbackModelBase({ })).to.throw(msg);
    });

    it('creates an instance with the given values', function(){
        const instance = new LoopbackModelBase({ model: {}, modelName: 'test' });

        expect(instance).to.have.property('modelName', 'test');
    });

    it('throws an error when calling get env without Loopback being booted', function(){
        const instance = new LoopbackModelBase({ model: {}, modelName: 'test' });
        const msg = 'The Loopback application environment could not be loaded because the' +
            'application was not initalized yet (it might not be booted)';

        expect(() => instance.getEnv()).to.throw(msg);
    });

    it('createError returns an error ', function(){
        const error = LoopbackModelBase.createError('test error');

        expect(error).to.have.property('message', 'test error');
    });

    it('throws an error when the extending model tries to override Loopback model internals', function(){
        class TestModel extends LoopbackModelBase {
            // this is a loopback internal model function
            remoteMethod(){}
        }
        const model = {
            remoteMethod(){},
            modelName: 'LoopbackTest',
        };
        // message should contain remote method and LoopbackTest
        expect(() => new TestModel({model})).to.throw(/remoteMethod.*?LoopbackTest/gi);
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
