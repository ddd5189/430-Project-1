// 1 - pull in the HTTP server module and other moduls
const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

// 2 - locally this will be 3000, on Heroku it will be assigned
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// 3 - urlStruct
const urlStruct = {
  '/random-joke': responseHandler.getRandomJokeResponse,
  '/random-jokes': responseHandler.getRandomJokesResponse,
  '/joke-client.html': htmlHandler.getIndexResponse,
  '/styles/default-styles.css': htmlHandler.getStylesResponse,
  notFound: htmlHandler.get404Response,
};

// 4 - this is the function that will be called every time a client request comes in
// this time we will look at the `pathname`, and send back the appropriate page
// note that in this course we'll be using arrow functions 100% of the time in our server-side code
const onRequest = (request, response) => {
  let acceptedTypes = request.headers.accept && request.headers.accept.split(',');
  acceptedTypes = acceptedTypes || [];

  const parsedUrl = url.parse(request.url);
  const { pathname } = parsedUrl;
  const params = query.parse(parsedUrl.query);
  const httpMethod = request.method;

  if (urlStruct[pathname]) {
    urlStruct[pathname](request, response, acceptedTypes, httpMethod, params);
  } else {
    urlStruct.notFound(request, response);
  }
};

// 5 - create the server, hook up the request handling function, and start listening on `port`
http.createServer(onRequest).listen(port);
