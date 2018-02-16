const { expect } = require('chai');

const MicroserviceError = require('../../src/MicroserviceError');

const TestError = class TestError extends MicroserviceError {};

describe('The MicroserviceError Class', function(){

    it('can be instantiated with a message', function(){
        const message = 'Wow, failed';
        const error = new MicroserviceError(message);

        expect(error).to.have.property('message', message);
    });

    it('takes additional data that are assigned to the error', function(){
        const message = 'Wow, failed';
        const status = 404;
        const error = new MicroserviceError(message, {status});

        expect(error).to.have.property('status', status);
    });

    it('can be thrown', function(){
        const message = 'Wow, failed';
        const status = 404;
        const error = new MicroserviceError(message, {status});

        expect(function(){
            throw error;
        }).to.throw(message);
    });

    it('can be catched and handled by its type', function(){
        const message = 'Wow, failed';
        const status = 404;
        const error = new MicroserviceError(message, {status});

        try {
            throw error;
        } catch(err) {
            if(!err instanceof MicroserviceError){
                throw err;
            }
        }
    });

    it('can be catched and handled on subtypes using instanceof', function(){
        const message = 'Wow, unhandled';
        const status = 404;
        const error = new TestError(message, {status});

        try {
            throw error;
        } catch(err) {
            if(!err instanceof MicroserviceError){
                throw err;
            }
            if(!err instanceof TestError){
                throw err;
            }

            expect(err).to.have.property('name', 'TestError');
            expect(err).to.have.property('status', status);
            expect(err).to.have.property('message', message);
        }
    });
});
