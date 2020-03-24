/* eslint-disable no-console */
const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');
const browser = process.env.SAUCELABS_BROWSER || 'chrome';
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';

const getBrowserConfig = (browserGroup) => {
    const browserConfig = [];
    for (const candidateBrowser in supportedBrowsers[browserGroup]) {
        if (candidateBrowser) {
            const desiredCapability = supportedBrowsers[browserGroup][candidateBrowser];
            desiredCapability.tunnelIdentifier = tunnelName;
            desiredCapability.tags = ['pcq'];
            browserConfig.push({
                browser: desiredCapability.browserName,
                desiredCapabilities: desiredCapability
            });
        } else {
            console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
        }
    }
    return browserConfig;
};

const setupConfig = {
    tests: './step_definitions/**/probatepcqjourney.js',
    output: process.cwd() + '/functional-output',
    helpers: {
        WebDriverIO: {
            url: 'https://pcq-frontend-staging.service.core-compute-aat.internal',
            browser: supportedBrowsers[browser].browserName,
            waitforTimeout: 60000,
            cssSelectorsEnabled: 'true',
            windowSize: '1600x900',
            host: 'ondemand.eu-central-1.saucelabs.com',
            port: 80,
            region: 'eu',
            user: process.env.SAUCE_USERNAME || 'username',
            key: process.env.SAUCE_ACCESS_KEY || 'privatekey',
            desiredCapabilities: {}
        },
        SauceLabsReportingHelper: {require: './helpers/SauceLabsReportingHelper.js'},
        JSWait: {require: './helpers/JSWait.js'},
        ElementExist: {require: './helpers/ElementExist.js'},
        IdamHelper: {require: './helpers/idamHelper.js'},
        SessionHelper: {require: './helpers/SessionHelper.js'}
    },
    include: {
        I: 'test/end-to-end/pages/steps.js'
    },
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options: {steps: true}
            },
            'mocha-junit-reporter': {
                stdout: '-',
                options: {mochaFile: '/functional-output/result.xml'}
            },
            mochawesome: {
                stdout: './functional-output/console.log',
                options: {
                    reportDir: './functional-output',
                    reportName: 'index',
                    inlineAssets: true
                }
            }
        }
    },
    multiple: {
        microsoftIE11: {
            browsers: getBrowserConfig('microsoftIE11')
        },
        microsoftEdge: {
            browsers: getBrowserConfig('microsoftEdge')
        },
        chrome: {
            browsers: getBrowserConfig('chrome')
        },
        firefox: {
            browsers: getBrowserConfig('firefox')
        }
    },
    name: 'Pcq Frontend Tests'
};
exports.config = setupConfig;
