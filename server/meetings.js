const express = require('express');
const meetingsRouter = express.Router();
const db = require('./db');
const { createError, bodyValidatorCreator } = require('./utils');
// /api/meetings

meetingsRouter.get('/', (req, res, next) => {
    const meetings = db.getAllFromDatabase('meetings');
    res.send(meetings);
});

meetingsRouter.post('/', (req, res, next) => {
    const added = db.addToDatabase('meetings', db.createMeeting());
    res.status(201).send(added);
})

meetingsRouter.delete('/', (req, res, next) => {
    db.deleteAllFromDatabase('meetings');
    res.status(204).send();
})

module.exports = meetingsRouter;
