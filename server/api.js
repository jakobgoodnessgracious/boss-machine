const express = require('express');
const ideasRouter = require('./ideas');
const meetingsRouter = require('./meetings');
const minionsRouter = require('./minions');
const apiRouter = express.Router();

apiRouter.use('/ideas', ideasRouter);
apiRouter.use('/meetings', meetingsRouter)
apiRouter.use('/minions', minionsRouter);

module.exports = apiRouter;
