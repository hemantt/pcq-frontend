const strykerConfiguration = config => {
    config.set({
        testRunner: 'mocha',
        mutator: 'javascript',
        transpilers: [],
        reporter:
            [
                'clear-text',
                'progress',
                'html'
            ],
        testFramework: 'mocha',
        coverageAnalysis: 'perTest',
        mutate:
            [
                'app/steps/ui/**/index.js'
            ],
        files: ['**/*'],
        maxConcurrentTestRunners: 2,
        symlinkNodeModules: false,
        htmlReporter: {baseDir: 'functional-output/mutation-assets'},
        mochaOptions: {
            files:
                [
                    'test/unit/*'
                ],
            timeout: 8000
        },
        logLevel: 'debug',
        plugins:
            [
                'stryker-mocha-runner',
                'stryker-mocha-framework',
                'stryker-javascript-mutator',
                'stryker-html-reporter'
            ]
    });
};

module.exports = strykerConfiguration;
