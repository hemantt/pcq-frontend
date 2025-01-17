'use strict';

const config = require('config');
const router = require('express').Router();
const initSteps = require('app/core/initSteps');
const logger = require('app/components/logger');
const get = require('lodash').get;
const initSession = require('app/middleware/initSession');
const registerIncomingService = require('app/registerIncomingService');
const validateParams = require('app/middleware/validateParams');
const optOut = require('app/middleware/optOut');

router.use(initSession);
router.use(registerIncomingService);

router.get('*', (req, res, next) => validateParams(req, res, next));

router.all('*', (req, res, next) => {
    const correlationId = get(req.session, 'correlationId', 'init');
    req.log = logger(correlationId);
    req.log.info(`Processing ${req.method} for ${req.originalUrl}`);
    next();
});

router.get('/', (req, res) => {
    req.log.info({tags: 'Analytics'}, 'Application Started');
    res.redirect(`${config.app.basePath}/start-page`);
});

router.post('/opt-out', optOut);

const allSteps = {
    'en': initSteps([`${__dirname}/steps/ui`], 'en'),
    'cy': initSteps([`${__dirname}/steps/ui`], 'cy')
};

router.use((req, res, next) => {
    const steps = allSteps[req.session.language];

    Object.entries(steps).forEach(([, step]) => {
        router.get(step.constructor.getUrl(), step.runner().GET(step));
        router.post(step.constructor.getUrl(), step.runner().POST(step));
    });

    res.locals.session = req.session;
    res.locals.pageUrl = req.url;
    next();
});

router.get('/health/liveness', (req, res) => {
    res.json({status: 'UP'});
});

module.exports = router;
