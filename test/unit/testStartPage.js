'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui`]);
const StartPage = steps.StartPage;

describe('StartPage', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = StartPage.constructor.getUrl();
            expect(url).to.equal('/start-page');
            done();
        });
    });
});
