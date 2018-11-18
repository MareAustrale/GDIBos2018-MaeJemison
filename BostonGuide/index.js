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

const AboutIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AboutIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        // const plantSlot = request.intent.slots.plant.value;
        const plantSlot = request.intent.slots.plant.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        // console.log(plantSlot);
        // if user doesn't specify a plant name, default to Ivy
        let plantName = 'ivy';
        if (plantSlot) {
            plantName = plantSlot;
        }

        const plantDetails = getPlantByName(plantName);
        const speechOutput = `${plantDetails.about
        }. Would you like to know more about your plant? You can ask me about how much water a plant needs or its lighting condition.`;

        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const WaterIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type == 'IntentRequest' && request.intent.name == 'WaterIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const plantSlot = request.intent.slots.plant.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        // console.log(plantSlot);
        // if user doesn't specify a plant name, default to Ivy
        let plantName = 'ivy';
        if (plantSlot) {
            plantName = plantSlot;
        }

        const plantDetails = getPlantByName(plantName);
        const speechOutput = `Watering instructions for ${plantDetails.name}.
        ${plantDetails.waterOccurence}. Would you like to hear more?`;

        const card = `${plantDetails.name}\n${plantDetails.location}\n
            ${plantDetails.waterOccurence}\n${plantDetails.lighting}`;

        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .withSimpleCard(SKILL_NAME, card)
            .getResponse();
    },
};

const LightingIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'LightingIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const plantSlot = request.intent.slots.plant.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        // console.log(plantSlot);
        // if user doesn't specify a plant name, default to Ivy
        let plantName = 'ivy';
        if (plantSlot) {
            plantName = plantSlot;
        }

        const plantDetails = getPlantByName(plantName);
        const speechOutput = `${plantDetails.name
        } needs , ${plantDetails.lighting
        } Would you like to hear more?`;

        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const ScheduleReminderIntent = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'ScheduleReminderIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const reminder = request.intent.slots.reminder.value;
        const date = request.intent.slots.date.value;
        const time = request.intent.slots.time.value;

        const speechOutput = `Very well. I will remind you to ${reminder} on ${date} at ${time}`;

        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};
const KindIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'KindIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const kind = request.intent.slots.kind.value;

        const speechOutput = `Ok, here is a kind phrase ${data.kind}`;

        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
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
            WELCOME: 'Welcome to Plant Guide, where you can ask everything about your current plants in the house, or any other plants that you are curious about. Say tell me about Ivy or any plant to hear more about your current plants, or say last watering, soil condition or order supplie son Amazon',
            HELP: 'Say about, to hear more about your current plants, or say last watering, soil condition or order supplies, to hear information about your plants, order supplies on Amazon, or say kind words',
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
    kind: "You are beautiful in everything you do. The world can't bring you down.",
    plants: [
        {
          name: 'Ficus Bonsai Tree',
          about: 'Also known as the common Fig and Chinese Banyan, this bonsai tree grows naturally in Southwest Asia. There are hundreds of species, most of them tropical and evergreen, although some are deciduous. Many varieties are natural dwarfs. Ficus is one of the most popular trees for indoor Bonsai. It is an excellent tree for beginners and pros alike. Virtually care free; they tolerate low light and humidity of a heated or air-conditioned house. The “banyan” style roots are commonly trained in a root-over-rock style.',
          waterOccurence: 'water generously whenever the soil gets slightly dry.',
          lighting: 'direct sunlight',
          location: 'indoor'
        },
        {
          name: 'Lucky Bamboo',
          about: 'Lucky bamboo is a houseplant that grows in water. Its canes, stalks or stems resemble the canes of a bamboo plant. Lucky Bamboo has been a part of Chinese culture for thousands of years but has really skyrocketed into popularity in the past 15 years and is now commonly found in many parts of the world.',
          waterOccurence: 'monitor when the first 1 to 2 inches of soil becomes dry to damp, it’s time to water bamboo',
          lighting: 'filtered light',
          location: 'indoor'
        },
        {
          name: 'Jade',
          about: 'Jade plant, a symbol of good luck, is a succulent plant with small pink or white flowers. It is native to South Africa and Mozambique, and is common as a houseplant worldwide. ',
          waterOccurence: 'allow to dry between waterings',
          lighting: 'put by a south or west window',
          location: 'indoor'
        },
        {
          name: 'Spider Plant',
          about: 'The spider plant is considered one of the most adaptable of houseplants and the easiest to grow. This plant can grow in a wide range of conditions and suffers from few problems, other than brown tips. The spider plant is so named because of its spider-like plants, or spiderettes, which dangle down from the mother plant like spiders on a web. Available in green or variegated varieties, these spiderettes often start out as small white flowers.',
          waterOccurence: 'Keep soil moist',
          lighting: 'indirect light',
          location: 'indoor'
        },
        {
          name: 'Ivy',
          about: 'ivy is a genus of 12–15 species of evergreen climbing or ground-creeping woody plants in the family Araliaceae, native to western, central and southern Europe, Macaronesia, northwestern Africa and across central-southern Asia east to Japan and Taiwan.',
          waterOccurence: 'allow to dry between waterings',
          lighting: 'bright light',
          location: 'indoor'
        },
        {
          name: 'Pothos',
          about: 'Indoors, the pothos plant usually confines itself to about six to 10 feet. Its leaves are bright and waxy with a noteworthy pointed heart shape, and are often green or variegated in white, yellow, or pale green. It is rare for them to flower or produce berries, especially indoors, but certain varietals can have tiny, petal-less white flowers that feature small berries.',
          waterOccurence: 'keep soil moist',
          lighting: 'adequate light',
          location: 'indoor'
        },
        {
          name: 'Christmas Cactus',
          about: 'A Christmas Cactus is a tropical plant that does not naturally exist in nature. It was bred from two unique parent plants that both grow in the South American rainforests, specifically in Brazil. The plant is recognizable by its segmented stem and the brightly colored blooms that appear at the ends of them. Blooms are typically red, pink, purple, yellow, or white, and the blooms can occur at different times throughout the year. Most notably, they can appear near Christmas, which is where the name is derived.',
          waterOccurence: 'once a month',
          lighting: 'bright light',
          location: 'indoor'
        }
    ]
};

const SKILL_NAME = 'Plant Guide';
const FALLBACK_MESSAGE = `The ${SKILL_NAME} skill can\'t help you with that.  It can help you learn about the plants in your house if you say tell me about this plant. What can I help you with?`;
const FALLBACK_REPROMPT = 'What can I help you with?';



// 3. Helper Functions ==========================================================================


const myAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET',
};

function getPlantByName(plantName) {
    let plant = {};
    for (let i = 0; i < data.plants.length; i += 1) {
        if (data.plants[i].name === plantName) {
            plant = data.plants[i];
        }
    }
    return plant;
}

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
    AboutIntentHandler,
    WaterIntentHandler,
    LightingIntentHandler,
    ScheduleReminderIntent,
    KindIntentHandler,
    YesHandler,
    HelpHandler,
    StopHandler,
    FallbackHandler,
    SessionEndedHandler
  )
  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(LocalizationInterceptor)
  .lambda();
