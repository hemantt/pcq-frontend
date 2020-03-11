'use strict';

const pageUnderTest = require('app/steps/ui/maritalstatus/index');

module.exports = function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('White');
    I.click('Continue');
};
