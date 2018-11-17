const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const https = require('https');

const skillBuilder = Alexa.SkillBuilders.custom();

const LaunchRequestHandler = {
  canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        const speechOutput = `${requestAttributes.t('WELCOME')}`;
        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const LunchIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'DiscoverLunchIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurant = randomArrayElement(getRestaurantsByMeal('lunch'));
        sessionAttributes.restaurant = restaurant.name;
        const speechOutput = `Lunch time! Here is a good spot. ${restaurant.name}. Would you like to hear more?`;
        
        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};

/*
const AttractionIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'DiscoverAttractionIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;
        
        const sessionAttributes = attributesManager.getSessionAttributes();
        const attraction = randomArrayElement(getAttractionsByDistance('5'));
        sessionAttributes.attraction = attraction.name;
        const speechOutput = `Try out ${attraction.name}. ${attraction.description}. Have fun!`;
        
        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};
*/

const CoffeeIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'DiscoverCoffeeIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurant = randomArrayElement(getRestaurantsByMeal('coffee'));
        sessionAttributes.restaurant = restaurant.name;
        const speechOutput = `For a great coffee shop, I recommend, ${restaurant.name}. Would you like to hear more?`;

        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};


const BreakfastIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'DiscoverBreakfastIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurant = randomArrayElement(getRestaurantsByMeal('breakfast'));
        sessionAttributes.restaurant = restaurant.name;
        const speechOutput = `For breakfast, try this, ${restaurant.name}. Would you like to hear more?`;

        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};

const DinnerIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'DiscoverDinnerIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurant = randomArrayElement(getRestaurantsByMeal('dinner'));
        sessionAttributes.restaurant = restaurant.name;
        const speechOutput = `Enjoy dinner at, ${restaurant.name}. Would you like to hear more?`;

        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};

const AboutIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AboutIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();

        return responseBuilder
            .speak(requestAttributes.t('ABOUT'))
            .reprompt(requestAttributes.t('ABOUT'))
            .getResponse();
    },
};

const GoOutIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'GoOutIntent';
    },
    handle(handlerInput) {
        return new Promise((resolve) => {
            getWeather((localTime, currentTemp, currentCondition) => {
                const speechOutput = `It is ${localTime
                } and the weather in ${data.city
                } is ${
                    currentTemp} and ${currentCondition}`;
                resolve(handlerInput.responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse());
            });
        });
    },
};

const YesHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurantName = sessionAttributes.restaurant;
        const restaurantDetails = getRestaurantByName(restaurantName);
        const speechOutput = `${restaurantDetails.name
        } is located at ${restaurantDetails.address
        }, the phone number is ${restaurantDetails.phone
        }, and the description is, ${restaurantDetails.description
        }  I have sent these details to the Alexa App on your phone.  Enjoy your meal!
        <say-as interpret-as="interjection">bon appetit</say-as>`;

        const card = `${restaurantDetails.name}\n${restaurantDetails.address}\n$
        {data.city}, ${data.state} ${data.postcode}\nphone: ${restaurantDetails.phone}\n`;

        return responseBuilder
            .speak(speechOutput)
            .withSimpleCard(SKILL_NAME, card)
            .getResponse();
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        return responseBuilder
            .speak(requestAttributes.t('HELP'))
            .reprompt(requestAttributes.t('HELP'))
            .getResponse();
    },
};

const StopHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.NoIntent'
            || request.intent.name === 'AMAZON.CancelIntent'
            || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        return responseBuilder
            .speak(requestAttributes.t('STOP'))
            .getResponse();
    },
};

const SessionEndedHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;

        console.log(`Error handled: ${error.message}`);
        console.log(` Original request was ${JSON.stringify(request, null, 2)}\n`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const FallbackHandler = {

  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.

  //              This handler will not be triggered except in that locale, so it can be

  //              safely deployed for any locale.

  canHandle(handlerInput) {

    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest'

      && request.intent.name === 'AMAZON.FallbackIntent';

  },

  handle(handlerInput) {

    return handlerInput.responseBuilder

      .speak(FALLBACK_MESSAGE)

      .reprompt(FALLBACK_REPROMPT)

      .getResponse();

  },

};

const languageStrings = {
    en: {
        translation: {
            WELCOME: 'Welcome to Boston, Massachusetts, a quintessential blend of colonial history and cutting-edge innovation. You may ask about the city or coffee, lunch, breakfast, dinner places or attractions or say go out',
            HELP: 'Say about, to hear more about the city, or say coffee, breakfast, lunch, or dinner, to hear local restaurant suggestions, or say recommend an attraction, or say, go outside. ',
            ABOUT: 'Boston is Massachusetts’ capital and largest city. Founded in 1630, it’s one of the oldest cities in the U.S. The key role it played in the American Revolution is highlighted on the Freedom Trail, a 2.5-mile walking route of historic sites that tells the story of the nation’s founding. One stop, former meeting house Faneuil Hall, is a popular marketplace.',
            STOP: 'Okay, see you next time!',
        },
    },
    // , 'de-DE': { 'translation' : { 'TITLE'   : "Local Helfer etc." } }
};
const data = {
    city: 'Boston',
    state: 'MA',
    postcode: '02142',
    restaurants: [
        {
            name: "Zeke's Place",
            address: '66 East Main Street',
            phone: '978-283-0474',
            meals: 'breakfast, lunch',
            description: 'A cozy and popular spot for breakfast.  Try the blueberry french toast!',
        },
        {
            name: 'Morning Glory Coffee Shop',
            address: '25 Western Avenue',
            phone: '978-281-1851',
            meals: 'coffee, breakfast, lunch',
            description: 'A homestyle diner located just across the street from the harbor sea wall.',
        },
        {
            name: 'Sugar Magnolias',
            address: '112 Main Street',
            phone: '978-281-5310',
            meals: 'breakfast, lunch',
            description: 'A quaint eatery, popular for weekend brunch.  Try the carrot cake pancakes.',
        },
        {
            name: 'Seaport Grille',
            address: '6 Rowe Square',
            phone: '978-282-9799',
            meals: 'lunch, dinner',
            description: 'Serving seafood, steak and casual fare.  Enjoy harbor views on the deck.',
        },
        {
            name: 'Latitude 43',
            address: '25 Rogers Street',
            phone: '978-281-0223',
            meals: 'lunch, dinner',
            description: 'Features artsy decor and sushi specials.  Live music evenings at the adjoining Minglewood Tavern.',
        },
        {
            name: "George's Coffee Shop",
            address: '178 Washington Street',
            phone: '978-281-1910',
            meals: 'coffee, breakfast, lunch',
            description: 'A highly rated local diner with generously sized plates.',
        },

    ],
    attractions: [
        {
            name: 'Whale Watching',
            description: 'Boston has tour boats that depart twice daily from Rogers street at the harbor.  Try either the 7 Seas Whale Watch, or Captain Bill and Sons Whale Watch. ',
            distance: '0',
        },
        {
            name: 'Good Harbor Beach',
            description: 'Facing the Atlantic Ocean, Good Harbor Beach has huge expanses of soft white sand that attracts hundreds of visitors every day during the summer.',
            distance: '2',
        },
        {
            name: 'Rockport',
            description: 'A quaint New England town, Rockport is famous for rocky beaches, seaside parks, lobster fishing boats, and several art studios.',
            distance: '4',
        },
        {
            name: 'Fenway Park',
            description: 'Home of the Boston Red Sox, Fenway park hosts baseball games From April until October, and is open for tours. ',
            distance: '38',
        },
    ],
};

const SKILL_NAME = 'Boston Guide';
const FALLBACK_MESSAGE = `The ${SKILL_NAME} skill can\'t help you with that.  It can help you learn about Boston if you say tell me about this place. What can I help you with?`;
const FALLBACK_REPROMPT = 'What can I help you with?';



// 3. Helper Functions ==========================================================================


const myAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET',
};

function getRestaurantsByMeal(mealType) {
    const list = [];
    for (let i = 0; i < data.restaurants.length; i += 1) {
        if (data.restaurants[i].meals.search(mealType) > -1) {
            list.push(data.restaurants[i]);
        }
    }
    return list;
}

function getRestaurantByName(restaurantName) {
    let restaurant = {};
    for (let i = 0; i < data.restaurants.length; i += 1) {
        if (data.restaurants[i].name === restaurantName) {
            restaurant = data.restaurants[i];
        }
    }
    return restaurant;
}

function getAttractionsByDistance(maxDistance) {
    const list = [];

    for (let i = 0; i < data.attractions.length; i += 1) {
        if (parseInt(data.attractions[i].distance, 10) <= maxDistance) {
            list.push(data.attractions[i]);
        }
    }
    return list;
}

function getWeather(callback) {
    const req = https.request(myAPI, (res) => {
        res.setEncoding('utf8');
        let returnData = '';

        res.on('data', (chunk) => {
            returnData += chunk;
        });
        res.on('end', () => {
            const channelObj = JSON.parse(returnData).query.results.channel;

            let localTime = channelObj.lastBuildDate.toString();
            localTime = localTime.substring(17, 25).trim();

            const currentTemp = channelObj.item.condition.temp;

            const currentCondition = channelObj.item.condition.text;

            callback(localTime, currentTemp, currentCondition);
        });
    });
    req.end();
}

function randomArrayElement(array) {
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return (array[i]);
}

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true,
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    },
};


exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    LunchIntentHandler,
    CoffeeIntentHandler,
    BreakfastIntentHandler,
    DinnerIntentHandler,
    AboutIntentHandler,
    GoOutIntentHandler,
    YesHandler,
    HelpHandler,
    StopHandler,
    FallbackHandler,
    SessionEndedHandler
    //,
    //AttractionIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(LocalizationInterceptor)
  .lambda();