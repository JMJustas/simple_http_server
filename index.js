const http = require('http');
const fs = require('fs');
const url = require('url');

/**
 * A helper function that asynchronously reads a specified file
 */
function readStaticFile(name) {
 return new Promise(
  (resolve, reject) => fs.readFile(name, (err, data) => {
    if (err) return reject(err);
    return resolve(data);
  }))
}

/**
 * A helper function that reads data from request body and returns it as string
 */
function readRequestBody(req) {
  let body = '';
  return new Promise(
    (resolve, reject) => {
      try {
        req.on('data', (chunk) => {
          body += chunk.toString()
        });

        req.on('end', () => {
          return resolve(body)
        });
      } catch (err) {
        return reject(err);
      }
    });
}

/**
 * Request handler function
 */
async function handleRequest(req, res) {
  console.log(`Incoming request: ${req.method} ${req.url}`);

  const parsedUrl = url.parse(req.url, true);

  try {
    // GET /
    if (parsedUrl.pathname === '/' && req.method === 'GET'){

      const content = `
        <html>
            <head> <title>A very simple web app</title> </head>
            <body>
                <div id="view"></div>
                <script src="/static/js/app.js"></script>
            </body>
        </html>`;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write(content);
      res.end();
      return;
    }

    // POST /
    if (parsedUrl.pathname === '/' && req.method === 'POST'){

      const body = await readRequestBody(req);
      const params = JSON.parse(body);
      const a = parseInt(params.a);
      const b = parseInt(params.b);

      if (isNaN(a) || isNaN(b)) {
        throw new Error("Got not a number as sum argument")
      }

      const sum = a + b;

      const payload = JSON.stringify({ result: sum });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.write(payload);
      res.end();
      return;
    }

    // Serve static html content
    if (parsedUrl.pathname.startsWith(`/static/pages`) && req.method === 'GET') {
      const content = await readStaticFile('.' + parsedUrl.pathname);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write(content);
      res.end();
      return;
    }

    // Serve static javascript content
    if (parsedUrl.pathname.startsWith(`/static/js`) && req.method === 'GET') {
      const content = await readStaticFile('./' + parsedUrl.pathname);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/javascript');
      res.write(content);
      res.end();
      return;
    }


    // No route matched the request
    const content = await readStaticFile('./static/not_found.html');
    res.statusCode = 404; // 404 Not Found
    res.setHeader('Content-Type', 'text/html');
    res.write(content);
    return res.end();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.write(err.message);
    return res.end();
  }
}

// Create a http server with our request handler function
const httpServer = http.createServer(handleRequest);

// Start server
const port = 8080;
httpServer.listen(port, () => {
  console.log('HTTP server started and listening on port ' + port);
});
