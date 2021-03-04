// adding underscore for shuffle
const _ = require('underscore');
// adding uuid for unique ids
const { v4: uuidv4 } = require('uuid');

// object of all the reviews
const reviews = {
  id: {
    game: 'gameName',
    rating: 'gameRating',
    platforms:
      [
        'gamePlatform1',
        'gamePlatform2',
      ],
    content: 'reviewContent',
  },
  id2: {
    game: 'gameName2',
    rating: 'gameRating2',
    platforms:
    [
      'gamePlatform1',
      'gamePlatform3',
    ],
    content: 'reviewContent2',
  },
  id3: {
    game: 'gameName3',
    rating: 'gameRating3',
    platforms:
    [
      'gamePlatform2',
      'gamePlatform3',
    ],
    content: 'reviewContent3',
  },
  id4: {
    game: 'gameName4',
    rating: 'gameRating4',
    platforms:
    [
      'gamePlatform1',
      'gamePlatform2',
    ],
    content: 'reviewContent4',
  },
};

// array to allow indexing of the reviews
// when a user posts new data it will be added to this
let reviewArray = [
  reviews.id,
  reviews.id2,
  reviews.id3,
  reviews.id4,
];

// amount of reviews
let amountOfReviews = reviewArray.length;

// validate the limit param
const testLimitParam = (limitParam) => {
  let limit = Number(limitParam);
  limit = !limit ? 1 : limit;
  limit = limit < 1 ? 1 : limit;
  limit = limit > amountOfReviews ? amountOfReviews : limit;
  return limit;
};

// return accepted type
const findType = (acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') return 'text/xml';
  return 'application/json';
};

// ALWAYS GIVE CREDIT - in your code comments and documentation
// Source: https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string/29955838
// Refactored to an arrow function by ACJ
const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

// respond function
const respond = (request, response, content, type, statusCode) => {
  response.writeHead(statusCode, { 'Content-type': type });
  response.write(content);
  response.end();
};

// get meta data when the server receives a head request
const getMetaData = (request, response, content, acceptedTypes) => {
  const type = findType(acceptedTypes);
  const headers = {
    'Content-type': type,
    'Content-length': `${getBinarySize(content)}`,
  };
  response.writeHead(200, headers);
  response.end();
};

// "Meta" refers to *meta data*, in this case the HTTP headers
// const sendJSONResponseMeta = (request, response, responseCode) => {
//   response.writeHead(responseCode, { 'Content-Type': 'application/json' });
//   response.end();
// };

// function to get one joke in either json or xml
const getRandomReview = (params, acceptedTypes) => {
  const platformParam = params.platform;

  // get a random number for selecting which joke
  let reviewNumber = Math.floor(Math.random() * amountOfReviews);

  let review;

  if (platformParam != null) {
    // array to store objects with requested platform
    const platformArray = [];
    // add the objects from the full array if they have the platform
    for (let i = 0; i < reviewArray.length; i += 1) {
      const element = reviewArray[i];
      if (element.platforms.includes(platformParam)) {
        platformArray.push(element);
      }
    }
    // then set the review array equal to our new array
    // and make sure the random number recieved doesn't go out of bounds
    if (reviewNumber >= platformArray.length) {
      reviewNumber = Math.floor(Math.random() * platformArray.length);
    }
    review = platformArray[reviewNumber];
    // if there is no platformParam return normally
  } else {
    review = reviewArray[reviewNumber];
  }

  // client asked for xml
  if (acceptedTypes[0] === 'text/xml') {
    const xmlResponse = `<review><Game>${review.game}</game><Rating>${review.rating}</Rating><Platforms>${review.platforms}</Platforms><Review>${review.content}</Review></review>`;
    return xmlResponse;
  }
  // defualt
  const jsonResponse = {
    review,
  };
  return JSON.stringify(jsonResponse);
};

// function to get multiple jokes
const getRandomReviews = (params, acceptedTypes) => {
  const limitParam = params.limit;
  const platformParam = params.platform;

  // test the limit
  const limit = testLimitParam(limitParam);

  // shuffle the q array
  reviewArray = _.shuffle(reviewArray);

  // create an array that only has the objects that have the requested platform
  const platformArray = [];
  if (platformParam != null) {
    for (let i = 0; i < reviewArray.length; i += 1) {
      const element = reviewArray[i];
      if (element.platforms.includes(platformParam)) {
        platformArray.push(element);
      }
    }
  }
  // reviewArray.platforms.includes(platformParam)

  // client asked for xml NEED TO UPDATE
  if (acceptedTypes[0] === 'text/xml') {
    let xmlResponse = '<reviews>';

    for (let i = 0; i < limit; i += 1) {
      xmlResponse = `${xmlResponse}<review><Game>${reviewArray[i].game}
                    </Game><Rating>${reviewArray[i].rating}</Rating><Platforms>${reviewArray[i].platforms}</Platforms>
                    <Review>${reviewArray[i].review}</Review></review>`;
    }
    xmlResponse = `${xmlResponse} </reviews>`;
    return xmlResponse;
  }

  // defualt
  const jsonResponse = [];

  // testing check for if the platform param is used only send back objects with that platform
  for (let i = 0; i < limit; i += 1) {
    if (platformParam != null && i < platformArray.length) {
      jsonResponse.push(platformArray[i]);
    } else if (platformParam != null && i >= platformArray.length) {
      break;
    } else {
      jsonResponse.push(reviewArray[i]);
    }
  }
  return JSON.stringify(jsonResponse);
};

// code by Tony Jefferson
const addReview = (request, response, body) => {
  // here we are assuming an error, pessimistic aren't we?
  let responseCode = 400; // 400=bad request
  const responseJSON = {
    id: 'missingParams',
    message: 'all fields are required',
  };

  // missing fields
  if (!body.game || !body.rating || !body.platforms || !body.content) {
    return respond(request, response, JSON.stringify(responseJSON), 'application/json', responseCode);
  }

  // we DID get a name and age
  // if (users[body.name]) { // if the user exists
  //   responseCode = 204;
  //   users[body.name].age = body.age; // update
  //   return sendJSONResponseMeta(request, response, responseCode);
  // }

  const id = uuidv4();

  reviews[id] = {}; // make a new review
  // initialize values
  reviews[id].game = body.game;
  reviews[id].rating = body.rating;
  reviews[id].platforms = [body.platforms];
  reviews[id].content = body.content;

  // add the completed review to the array aswell
  reviewArray.push(reviews[id]);

  // increment to reflect new addition to array
  amountOfReviews += 1;

  responseCode = 201; // send "created" status code
  responseJSON.id = id; // send the unique id back to the user
  responseJSON.message = `Your Review for ${reviews[id].game} was Created Successfully`;
  return respond(request, response, JSON.stringify(responseJSON), 'application/json', responseCode);
};

const getRandomReviewResponse = (request, response, acceptedTypes, httpMethod, params) => {
  if (httpMethod === 'GET') {
    respond(request, response,
      getRandomReview(params, acceptedTypes), findType(acceptedTypes), 200);
  } else if (httpMethod === 'HEAD') {
    getMetaData(request, response, getRandomReview(acceptedTypes), acceptedTypes);
  }
};

const getRandomReviewsResponse = (request, response, acceptedTypes, httpMethod, params) => {
  if (httpMethod === 'GET') {
    // eslint said this line was too long
    respond(
      request,
      response,
      getRandomReviews(params, acceptedTypes),
      findType(acceptedTypes),
      200,
    );
  } else if (httpMethod === 'HEAD') {
    getMetaData(request, response, getRandomReviews(params, acceptedTypes), acceptedTypes);
  }
};

module.exports = {
  getRandomReviewResponse,
  getRandomReviewsResponse,
  addReview,
};
