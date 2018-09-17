const { expect } = require('chai');
const { describe, it } = require('mocha');

const MicroserviceError = require('../../src/MicroserviceError');
const testingUtilities = require('../../src/testing');


describe('The Microservice Testing Utilities', () => {

    it('exposes Mocha helpers', () => {
        expect(testingUtilities).to.have.property('mocha');
    });

    describe('for mocha', () => {

        it('exposes a helper to watch global variables by name', () => {
            expect(testingUtilities.mocha).to.have.property('watchGlobal').that.is.a('function');
        });

        describe('watchGlobal(variableName, setter)', () => {

            it('throws a MicroserviceError if someone sets a global variable', () => {
                testingUtilities.mocha.watchGlobal('globalTestWithError');
                expect(() => {
                    global.globalTestWithError = 'Oh No!';
                }).to.throw(MicroserviceError);
            });

            it(
                'allows passing an optional setter to be able to hook in custom behavior or the debugger',
                () => {
                    let counter = 0;
                    testingUtilities.mocha.watchGlobal('globalTestWithSetter', () => {
                        counter += 1;
                    });
                    expect(counter).to.be.equal(0);
                    global.globalTestWithSetter = 'Don\'t do that!';
                    expect(counter).to.be.equal(1);
                },
            );
        });
    });
});
