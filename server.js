const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
module.exports = app;

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

// Add middleware for handling CORS requests from index.html
app.use(cors(), morgan('short'));


// Add middware for parsing request bodies here:
app.use(bodyParser.json());


// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);
app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  // console.log(req.url, status, err.stack);
  console.log(req.url, status, message || err);
  res.status(status).send(message);
});


// This conditional is here for testing purposes:
if (!module.parent) {
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log('Server listening on port 4001');
  })
}
