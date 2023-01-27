const express = require('express');
const app = require('../server');
const minionsRouter = express.Router();
const db = require('./db');
const { createError, bodyValidatorCreator } = require('./utils');
// /api/minions
// name: 'string', typecheck and valid value, name: 'string:exists' typecheck and invalid value
const required = { name: 'string', title: 'string:exists', weaknesses: 'string:exists', salary: 'number:exists', id: { put: 'string' } };
const bodyValidator = bodyValidatorCreator(required);


minionsRouter.param('minionId', (req, res, next, id) => {
    const minion = db.getFromDatabaseById('minions', id);
    if (minion) {
        req.work = db.getAllFromDatabase('work').filter((work) => work.minionId === id);
        req.minion = minion;
        req.id = id;
        next();
    } else {
        next(createError(404, `Minion with id: [${id}] could not be found.`));
    }
});

minionsRouter.get('/', (req, res, next) => {
    const minions = db.getAllFromDatabase('minions');
    res.send(minions);
});
minionsRouter.post('/', bodyValidator, (req, res, next) => {
    const added = db.addToDatabase('minions', req.typedObject);
    res.status(201).send(added);
});
minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});
minionsRouter.put('/:minionId', bodyValidator, (req, res, next) => {
    const updated = db.updateInstanceInDatabase('minions', req.typedObject);
    res.send(updated);
});
minionsRouter.delete('/:minionId', (req, res, next) => {
    db.deleteFromDatabasebyId('minions', req.id);
    res.status(204).send();
});

// work
const workRequired = { title: 'string', description: 'string:exists', hours: 'number', minionId: 'string', id: { put: 'string' } }
const workBodyValidator = bodyValidatorCreator(workRequired);


minionsRouter.param('workId', (req, res, next, id) => {
    if (req.work) {
        req.workId = id;
        next();
    } else {
        next(createError(404, `Work with id: [${id}] could not be found.`));
    }
});

minionsRouter.get('/:minionId/work', (req, res, next) => {
    res.send(req.work);
});
minionsRouter.post('/:minionId/work', workBodyValidator, (req, res, next) => {
    const added = db.addToDatabase('work', req.typedObject);
    res.status(201).send(added);
});
minionsRouter.put('/:minionId/work/:workId', workBodyValidator, (req, res, next) => {
    const updated = db.updateInstanceInDatabase('work', req.typedObject);
    res.send(updated);
});
minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
    db.deleteFromDatabasebyId('work', req.workId);
    res.status(204).send();
});

module.exports = minionsRouter;
