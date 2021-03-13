const fs = require('fs'); // pull in the file system module

const indexPage = fs.readFileSync(`${__dirname}/../client/index.html`);
const appPage = fs.readFileSync(`${__dirname}/../client/app.html`);
const submitPage = fs.readFileSync(`${__dirname}/../client/submit.html`);
const adminPage = fs.readFileSync(`${__dirname}/../client/admin.html`);
const documentationPage = fs.readFileSync(`${__dirname}/../client/documentation.html`);
const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const cssFile = fs.readFileSync(`${__dirname}/../client/styles/default-styles.css`);
const bootstrapFile = fs.readFileSync(`${__dirname}/../node_modules/bootstrap/dist/css/bootstrap.min.css`);
const bootstrapMapFile = fs.readFileSync(`${__dirname}/../node_modules/bootstrap/dist/css/bootstrap.min.css.map`);
const imgFile = fs.readFileSync(`${__dirname}/../client/media/Proj1Img.jpg`);

// response template
const clientResponse = (request, response, content, type, statusCode) => {
  response.writeHead(statusCode, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// all the html/css/img respone functions
const getIndexResponse = (request, response) => clientResponse(request, response, indexPage, 'text/html', 200);

const getAppResponse = (request, response) => clientResponse(request, response, appPage, 'text/html', 200);

const getSubmitResponse = (request, response) => clientResponse(request, response, submitPage, 'text/html', 200);

const getAdminResponse = (request, response) => clientResponse(request, response, adminPage, 'text/html', 200);

const getDocumentationResponse = (request, response) => clientResponse(request, response, documentationPage, 'text/html', 200);

const get404Response = (request, response) => clientResponse(request, response, errorPage, 'text/html', 404);

const getStylesResponse = (request, response) => clientResponse(request, response, cssFile, 'text/css', 200);

const getBootstrapResponse = (request, response) => clientResponse(request, response, bootstrapFile, 'text/css', 200);

const getBootstrapMapResponse = (request, response) => clientResponse(request, response, bootstrapMapFile, 'text/css', 200);

const getImgResponse = (request, response) => clientResponse(request, response, imgFile, 'image/jpg', 200);

module.exports = {
  getIndexResponse,
  getAppResponse,
  getSubmitResponse,
  getAdminResponse,
  getDocumentationResponse,
  get404Response,
  getStylesResponse,
  getBootstrapResponse,
  getBootstrapMapResponse,
  getImgResponse,
};
