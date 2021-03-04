// pull in the HTTP server module and other moduls
const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

// locally this will be 3000, on Heroku it will be assigned
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// urlStruct
const urlStruct = {
  '/': htmlHandler.getIndexResponse,
  '/app': htmlHandler.getAppResponse,
  '/submit': htmlHandler.getSubmitResponse,
  '/admin': htmlHandler.getAdminResponse,
  '/review': responseHandler.getRandomReviewResponse,
  '/reviews': responseHandler.getRandomReviewsResponse,
  '/styles/default-styles.css': htmlHandler.getStylesResponse,
  notFound: htmlHandler.get404Response,
};

// code by Tony Jefferson
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/add-review') {
    const body = [];

    // https://nodejs.org/api/http.html
    request.on('error', (err) => {
      // console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString); // turn into an object with all the fields
      responseHandler.addReview(request, response, bodyParams);
    });
  }
};

// this is the function that will be called every time a client request comes in
// this time we will look at the `pathname`, and send back the appropriate page
// note that in this course we'll be using arrow functions 100% of the time in our server-side code
const onRequest = (request, response) => {
  let acceptedTypes = request.headers.accept && request.headers.accept.split(',');
  acceptedTypes = acceptedTypes || [];

  const parsedUrl = url.parse(request.url);
  const { pathname } = parsedUrl;
  const params = query.parse(parsedUrl.query);
  const httpMethod = request.method;

  if (request.method === 'POST') {
    // handle POST
    handlePost(request, response, parsedUrl);
    return; // bail out of function
  }

  if (urlStruct[pathname]) {
    urlStruct[pathname](request, response, acceptedTypes, httpMethod, params);
  } else {
    urlStruct.notFound(request, response);
  }
};

// create the server, hook up the request handling function, and start listening on `port`
http.createServer(onRequest).listen(port);
