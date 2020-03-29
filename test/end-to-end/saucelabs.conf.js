const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');

// eslint-disable-next-line no-unused-vars
const browser = process.env.SAUCELABS_BROWSER || 'chrome';
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reform_tunnel';
const waitForTimeout = 60000;
const smartWait = 45000;
const getBrowserConfig = (browserGroup) => {
    const browserConfig = [];
    for (const candidateBrowser in supportedBrowsers[browserGroup]) {
        if (candidateBrowser) {
            const desiredCapability = supportedBrowsers[browserGroup][candidateBrowser];
            desiredCapability.tunnelIdentifier = tunnelName;
            desiredCapability.acceptSslCerts = true;
            desiredCapability.tags = ['pcq-frontend'];
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
    output: `${process.cwd()}/functional-output`,
    timeout: 60000,
    helpers: {
        WebDriverIO: {
            url: process.env.TEST_URL || 'https://pcq-frontend-staging.service.core-compute-aat.internal',
            browser: 'chrome',
            smartWait,
            waitForTimeout,
            cssSelectorsEnabled: 'true',
            windowSize: '1600x900',
            timeouts: {
                script: 60000,
                'page load': 60000,
                implicit: 20000
            },
            host: 'ondemand.eu-central-1.saucelabs.com',
            port: 80,
            region: 'eu',
            sauceConnect: true,
            services: ['sauce'],
            user: process.env.SAUCE_USERNAME,
            key: process.env.SAUCE_ACCESS_KEY,
            desiredCapabilities: {}
        }
    },
    gherkin: {
        features: 'features/probate.feature',
        steps: ['./step_definitions/probatepcqjourney.js']
    },
    include: {
        'I': './pages/steps.js'
    },
    plugins: {
        autoDelay: {
            enabled: true,
            delayAfter: 2000
        }
    },
    SauceLabsReportingHelper: {
        require: './helpers/SauceLabsReportingHelper.js'
    },
    WebDriverHelper: {
        require: './helpers/WebDriverHelper.js'
    },
    JSWait: {
        require: './helpers/JSWait.js'
    },
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options:
                    {steps: true}
            },
            'mochawesome': {
                stdout: process.env.E2E_CROSSBROWSER_OUTPUT_DIR + 'console.log',
                'options': {
                    'reportDir': process.env.E2E_CROSSBROWSER_OUTPUT_DIR || './functional-output',
                    'reportName': 'index',
                    'reportTitle': 'Crossbrowser results',
                    'inlineAssets': true
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
        },
        safari: {
            browsers: getBrowserConfig('safari')
        }
    }
};

exports.config = setupConfig;
