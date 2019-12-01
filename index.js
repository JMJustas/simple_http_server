const http = require('http');
const fs = require('fs');

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

  try {
    // GET /
    if (req.url === '/' && req.method === 'GET'){

      const content = `
        <html>
            <head>
                <title>A very simple web app</title>
            </head>
            <body>
              <h1>Hello, world!</h1>
              <p>This is the index page</p>

              <p>This website has more pages:</p>

              <ul>
                  <li><a href="/static/pages/first.html"> The first page which is useless</a> </li>
                  <li><a href="/static/pages/second.html"> The second page which is also useless</a> </li>
              </ul>
            </body>  
        </html>
      `;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write(content);
      res.end();
      return;
    }

    // Serve static html content
    if (req.url.startsWith(`/static/pages`) && req.method === 'GET') {
      const content = await readStaticFile('.' + req.url);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
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
