const fs = require('fs'); // pull in the file system module

const indexPage = fs.readFileSync(`${__dirname}/../client/index.html`);
const appPage = fs.readFileSync(`${__dirname}/../client/app.html`);
const submitPage = fs.readFileSync(`${__dirname}/../client/submit.html`);
const adminPage = fs.readFileSync(`${__dirname}/../client/admin.html`);
const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const cssFile = fs.readFileSync(`${__dirname}/../client/styles/default-styles.css`);

const clientResponse = (request, response, content, type, statusCode) => {
  response.writeHead(statusCode, { 'Content-Type': type });
  response.write(content);
  response.end();
}

const getIndexResponse = (request, response) => {
  return clientResponse(request, response, indexPage, 'text/html', 200);
};

const getAppResponse = (request, response) => {
  return clientResponse(request, response, appPage, 'text/html', 200);
};

const getSubmitResponse = (request, response) => {
  return clientResponse(request, response, submitPage, 'text/html', 200);
};

const getAdminResponse = (request, response) => {
  return clientResponse(request, response, adminPage, 'text/html', 200);
};

const get404Response = (request, response) => {
  return clientResponse(request, response, errorPage, 'text/html', 404);
};

const getStylesResponse = (request, response) => {
  return clientResponse(request, response, cssFile, 'text/css', 200);

};

module.exports = {
  getIndexResponse,
  getAppResponse,
  getSubmitResponse,
  getAdminResponse,
  get404Response,
  getStylesResponse,
};
