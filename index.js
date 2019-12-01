const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');

const app = express();

// We use mustache as templating engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

// Parse request payload to json object in req.body
app.use(bodyParser.json());

// Log all the requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  // Pass request to next request handler in chain
  next();
});

// Render index using mustache
app.get('/', (req, res) => {
  // Let's also render current date
  const currentDate = new Date().toDateString();
  res.render('index', { currentDate });
});

// Some calculations without tedious body parsing
app.post('/', (req, res, next) => {
  const a = parseInt(req.body.a);
  const b = parseInt(req.body.b);

  if (isNaN(a) || isNaN(b)) {
     next(new Error("Got not a number as sum argument"));
  }

  const sum = a + b;

  res.json({ result: sum });
});

// Serving static files is really, really simple :)
app.use('/static/js', express.static(path.join(__dirname, "static/js")));
app.use('/static/pages', express.static(path.join(__dirname, "static/pages")));

// Everything that did not match any handlers will result in 404
app.use((req, res, next) => {
  res.statusCode = 404;
  res.sendFile(path.join(__dirname, 'static/not_found.html'));
});

// Unexpected error handler
app.use((err, req, res, next) => {
  console.log("Encountered an error: " + err.message);
  res.statusCode = 500;
  res.render('error', { err });
});

// Start server
const port = 8080;
app.listen(port, () => console.log('HTTP server started and listening on port ' + port));
