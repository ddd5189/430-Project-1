const fs = require('fs'); // pull in the file system module

const indexPage = fs.readFileSync(`${__dirname}/../client/joke-client.html`);
const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const cssFile = fs.readFileSync(`${__dirname}/../client/styles/default-styles.css`);

const getIndexResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(indexPage);
  response.end();
};

const get404Response = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write(errorPage);
  response.end();
};

const getStylesResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(cssFile);
  response.end();
};

module.exports = {
  getIndexResponse,
  get404Response,
  getStylesResponse,
};
