const express = require('express');
const { bodyValidatorCreator, createError } = require('./utils');
const db = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');
const ideasRouter = express.Router();

// /api/ideas

const required = { name: 'string', description: 'string:exists', numWeeks: 'number', weeklyRevenue: 'number', id: { put: 'string' } };
const bodyValidator = bodyValidatorCreator(required);

ideasRouter.param('ideaId', (req, res, next, id) => {
    const idea = db.getFromDatabaseById('ideas', id);
    if (idea) {
        req.idea = idea;
        req.id = id;
        next();
    } else {
        next(createError(404, `Idea with id: [${id}] could not be found.`));
    }
})

ideasRouter.get('/', (req, res, next) => {
    const ideas = db.getAllFromDatabase('ideas');
    res.send(ideas);
});

ideasRouter.post('/', bodyValidator, checkMillionDollarIdea, (req, res, next) => {
    const added = db.addToDatabase('ideas', req.typedObject);
    res.status(201).send(added);
});

ideasRouter.get('/:ideaId', (req, res, next) => {
    res.send(req.idea);
});

ideasRouter.put('/:ideaId', bodyValidator, checkMillionDollarIdea, (req, res, next) => {
    const updated = db.updateInstanceInDatabase('ideas', req.typedObject);
    res.send(updated);
});

ideasRouter.delete('/:ideaId', (req, res, next) => {
    db.deleteFromDatabasebyId('ideas', req.id);
    res.status(204).send();
})

module.exports = ideasRouter;
