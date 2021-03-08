// adding underscore for shuffle
const _ = require('underscore');
// adding uuid for unique ids
const { v4: uuidv4 } = require('uuid');

// object of all the reviews
const reviews = {
  id: {
    game: "Super Mario 3D World + Bowser's Fury",
    rating: 10,
    platforms:
      [
        'Nintendo Switch',
      ],
    content: "<i>Credit to 'GameSkinny':</i> With some of the cleverest level designs and a boundless sense of joy, "
    + "Mario 3D World + Bowser's Fury is essential playing for any Mario fan. Super Mario "
    + "3D World might be almost eight years old, but time hasn't dulled this cat's claws. "
    + "And while Bowser's Fury is short, it's full of so much potential for Mario's future, "
    + "making this the most easily recommended port-and-repackage of the Switch's lifecycle so far. ",
  },
  id2: {
    game: 'Hitman 3',
    rating: 9,
    platforms:
    [
      'Xbox',
      'PC',
      'Nintendo Switch',
    ],
    content: "<i>Credit to 'Noisy Pixel':</i> Hitman 3 builds on the structure of its predecessors but doesn't recycle old mechanics. "
    + 'Its creative sandbox systems encourage multiple playthroughs with possible outcomes only limited by your imagination. '
    + "Returning fans will get the most of this narrative as it ties up a few loose ends but doesn't totally stick the landing. "
    + "It's absolutely brilliant in execution, though, as you replay missions for different results providing the most robust "
    + 'experience to those who spend the most time playing.',
  },
  id3: {
    game: 'The Last of Us Part II',
    rating: 7,
    platforms:
    [
      'Playstation',
    ],
    content: "<i>Credit to 'Cultured Vultures':</i> In trying to subvert expectations, The Last of Us Part II discards the best aspects of its predecessor "
    + 'to provide a rote revenge tale that is ill-considered, ending on a note that makes everything — all the violence, '
    + 'all the loss, all the struggle — feel utterly, hopelessly pointless.',
  },
  id4: {
    game: 'Candy Crush Saga',
    rating: 6,
    platforms:
    [
      'Phone',
    ],
    content: "<i>Credit to 'Pocket Gamer UK':</i> A challenging, surprisingly imaginative match-3 puzzler - but there's little reason to tolerate its free-to-play "
    + 'fussiness with so much stellar competition in the field.',
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

// return the proper platform params
const platformParamParse = (platforms) => {
  // make sure the params are stored in an array
  let platformParamArray = [];
  // check if there's only 1 or multiple platforms suggested
  // and add to the array accordingly
  if (typeof platforms === 'string') {
    platformParamArray.push(platforms);
  } else {
    platformParamArray = platforms;
  }
  return platformParamArray;
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
const sendJSONResponseMeta = (request, response, responseCode) => {
  response.writeHead(responseCode, { 'Content-Type': 'application/json' });
  response.end();
};

// function to get one joke in either json or xml
const getRandomReview = (params, acceptedTypes) => {
  // get a random number for selecting which joke
  let reviewNumber = Math.floor(Math.random() * amountOfReviews);

  const platformParam = platformParamParse(params.platform);
  // review to send back
  let review;

  if (platformParam != null) {
    // array to store objects with requested platform
    const platformArray = [];
    // go through each review and check its platforms array
    // to see if any of the pased in platforms are in it
    for (let i = 0; i < reviewArray.length; i += 1) {
      for (let y = 0; y < platformParam.length; y += 1) {
        // if the platform is included and it's not already in the array add it
        if (reviewArray[i].platforms.includes(platformParam[y])
            && !platformArray.includes(reviewArray[i])) {
          platformArray.push(reviewArray[i]);
        }
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
    const xmlResponse = `<review><Game>${review.game}</Game><Rating>${review.rating}</Rating><Platforms>${review.platforms}</Platforms><Review>${review.content}</Review></review>`;
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
  const limit = testLimitParam(params.limit);
  const platformParam = platformParamParse(params.platform);

  // shuffle the q array
  reviewArray = _.shuffle(reviewArray);

  // create an array that only has the objects that have the requested platform
  const platformArray = [];
  if (platformParam != null) {
    // go through each review and check its platforms array
    // to see if any of the pased in platforms are in it
    for (let i = 0; i < reviewArray.length; i += 1) {
      for (let y = 0; y < platformParam.length; y += 1) {
        // if the platform is included and it's not already in the array add it
        if (reviewArray[i].platforms.includes(platformParam[y])
            && !platformArray.includes(reviewArray[i])) {
          platformArray.push(reviewArray[i]);
        }
      }
    }
  }

  // reviewArray.platforms.includes(platformParam)

  // client asked for xml NEED TO UPDATE
  if (acceptedTypes[0] === 'text/xml') {
    let xmlResponse = '<reviews>';

    for (let i = 0; i < limit; i += 1) {
      xmlResponse = `${xmlResponse}<review><Game>${reviewArray[i].game}</Game>
      <Rating>${reviewArray[i].rating}</Rating><Platforms>${reviewArray[i].platforms}</Platforms>
      <Review>${reviewArray[i].content}</Review></review>`;
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

// starter code by Tony Jefferson
const addReview = (request, response, body) => {
  // here we are assuming an error, pessimistic aren't we?
  let responseCode = 400; // 400=bad request
  const responseJSON = {
    id: 'missingParams',
    message: 'Please make sure you fill in all the require fields',
  };

  // missing fields
  if (!body.game || !body.rating || !body.platforms || !body.content) {
    return respond(request, response, JSON.stringify(responseJSON), 'application/json', responseCode);
  }

  const postedReview = reviews[body.id];
  // we DID get a name and age
  if (postedReview) { // if the user exists
    responseCode = 204;
    // initialize values
    postedReview.game = body.game;
    postedReview.rating = body.rating;
    // distinguish between getting 1 or multiple platforms
    if (typeof body.platforms === 'string') { postedReview.platforms = [body.platforms]; } else { postedReview.platforms = body.platforms; }
    postedReview.content = body.content;
    return sendJSONResponseMeta(request, response, responseCode);
  }

  const id = uuidv4();

  reviews[id] = {}; // make a new review
  // initialize values
  reviews[id].game = body.game;
  reviews[id].rating = body.rating;
  // distinguish between getting 1 or multiple platforms
  if (typeof body.platforms === 'string') { reviews[id].platforms = [body.platforms]; } else { reviews[id].platforms = body.platforms; }
  reviews[id].content = body.content;

  // add the completed review to the array aswell
  reviewArray.push(reviews[id]);

  // increment to reflect new addition to array
  amountOfReviews += 1;

  responseCode = 201; // send "created" status code
  responseJSON.message = `Your Review for<b>${reviews[id].game}</b>was Created Successfully`;
  responseJSON.id = `Use this ID to update your review in the future<br>ID:<b>${id}</b>`; // send the unique id back to the user
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
