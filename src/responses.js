// adding underscore for shuffle
const _ = require('underscore');

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
    review: 'reviewContent',
  },
  id2: {
    game: 'gameName2',
    rating: 'gameRating2',
    platforms:
    [
      'gamePlatform1',
      'gamePlatform3',
    ],
    review: 'reviewContent2',
  },
  id3: {
    game: 'gameName3',
    rating: 'gameRating3',
    platforms:
    [
      'gamePlatform2',
      'gamePlatform3',
    ],
    review: 'reviewContent3',
  },
  id4: {
    game: 'gameName4',
    rating: 'gameRating4',
    platforms:
    [
      'gamePlatform1',
      'gamePlatform2',
    ],
    review: 'reviewContent4',
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
const amountOfReviews = reviewArray.length;

// validate the limit param
const testParam = (limitParam) => {
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

// function to get one joke in either json or xml
const getRandomReview = (acceptedTypes) => {
  // get a random number for selecting which joke
  const reviewNumber = Math.floor(Math.random() * amountOfReviews);

  const review = reviewArray[reviewNumber];

  // client asked for xml
  if (acceptedTypes[0] === 'text/xml') {
    const xmlResponse = `<review><Game>${review.game}</game><Rating>${review.rating}</Rating><Platforms>${review.platforms}</Platforms><Review>${review.review}</Review></review>`;
    return xmlResponse;
  }
  // defualt
  const jsonResponse = {
    game: review.game,
    rating: review.rating,
    platforms: review.platforms,
    review: review.review,
  };
  return JSON.stringify(jsonResponse);
};

// function to get multiple jokes
const getRandomReviews = (params, acceptedTypes) => {
  const limitParam = params.limit;
  const platformParam = params.platform;
  // test the limit
  const limit = testParam(limitParam);
  // shuffle the q array
  reviewArray = _.shuffle(reviewArray);

  // client asked for xml
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
  let jsonResponse;
  const jsonResponseReturn = [];

  // testing check for if the platform param is used only send back objects with that platform
  for (let i = 0; i < limit; i += 1) {
    if (platformParam != null && reviewArray[i].platforms.includes(platformParam)) {
      jsonResponse = {
        game: reviewArray[i].game,
        rating: reviewArray[i].rating,
        platforms: reviewArray[i].platforms,
        review: reviewArray[i].review,
      };
    } else {
      jsonResponse = {
        game: reviewArray[i].game,
        rating: reviewArray[i].rating,
        platforms: reviewArray[i].platforms,
        review: reviewArray[i].review,
      };
    }
    jsonResponseReturn.push(jsonResponse);
  }
  return JSON.stringify(jsonResponseReturn);
};

const getRandomReviewResponse = (request, response, acceptedTypes, httpMethod) => {
  if (httpMethod === 'GET') {
    respond(request, response, getRandomReview(acceptedTypes), findType(acceptedTypes), 200);
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
};
