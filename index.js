const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const https = require('https');
// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

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

        const plantSlot = request.intent.slots.plant.value;
        console.log(plantSlot);
        // if user doesn't specify a plant name, default to Ivy
        let plantName = 'ivy';
        if (plantSlot) {
            plantName = plantSlot;
        }

        const plantDetails = getPlantByName(plantName);
        const speechOutput = `${plantDetails.name
        } is located ${plantDetails.location
        }. You will want to ${plantDetails.waterOccurance
        }, and it needs , ${plantDetails.lighting
        } Would you like to hear more?`;

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

        const plantSlot = request.intent.slots.plant.value;
        let plantName = 'ivy';
        if (plantSlot) {
            plantName = plantSlot;
        }

        const plantDetails = getPlantByName(plantName);
        const speechOutput = `Watering instructions for ${plantDetails.name}.
        ${plantDetails.waterOccurance}. Would you like to hear more?`;

        const card = `${plantDetails.name}\n${plantDetails.location}\n
            ${plantDetails.waterOccurance}\n${plantDetails.lighting}`;

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

        const plantSlot = request.intent.slots.plant.value;

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

// As long as valid slot exists for the plant_name, can add into database
const SetLastWaterIntentHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest' && request.intent.name === 'SetLastWaterIntent';
    },
    handle(handlerInput) {
       const request = handlerInput.requestEnvelope.request;
       const attributesManager = handlerInput.attributesManager;
       const responseBuilder = handlerInput.responseBuilder;

       const plantSlot = request.intent.slots.plant.value;
       let plantName = "no plant";
       if (plantSlot) {
         plantName = plantSlot;
       }
       //get time of last water, currently hardcoded to now
       lastWaterTime = Date.now()/1000;

       //write check to make sure plantName isn't already in DB
       // if it is in DB, can update the lastWater field to now

       console.log("Print Set Last Water Intent Info (plantname, lastWaterTime):");
       setLastWater(plantName, lastWaterTime);

       const speechOutput = `Added ${plantName} to plant app database. Set today as
              last time ${plantName} was watered. Would you like to hear more?`

       return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    }
}


const GetLastWaterIntentHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;

      return request.type === 'IntentRequest' && request.intent.name === 'GetLastWaterIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const plantSlot = request.intent.slots.plant.value;

        // if user doesn't specify plant name, dedault to ivy
        let plantName = 'ivy';
        if (plantSlot) {
            plantName = plantSlot;
        }

        //const plantDetails = getPlantByName(plantName);
        var lastWaterDate = getLastWater(plantName);

        const speechOutput = `The last time ${plantName} was watered was ${lastWaterDate}
        Would you like to hear more?`;

        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    }
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
            WELCOME: 'Welcome to Plant Guide, where you can ask everything about your current plants in the house. Say about, to hear more about your current plants, or say last watering, soil condition or order supplies, to hear information about your plants, order supplies on Amazon',
            HELP: 'Say about, to hear more about your current plants, or say last watering, soil condition or order supplies, to hear information about your plants, order supplies on Amazon, or....',
            ABOUT: 'Boston is Massachusetts’ capital and largest city. Founded in 1630, it’s one of the oldest cities in the U.S. The key role it played in the American Revolution is highlighted on the Freedom Trail, a 2.5-mile walking route of historic sites that tells the story of the nation’s founding. One stop, former meeting house Faneuil Hall, is a popular marketplace.',
            STOP: 'Okay, see you next time!',
        },
    },
    // , 'de-DE': { 'translation' : { 'TITLE'   : "Local Helfer etc." } }
};
const data = {
    plants: [
        {
          name: 'ficus bonsai tree',
          waterOccurance: 'water generously whenever the soil gets slightly dry.',
          lighting: 'direct sunlight',
          location: 'indoor'
        },
        {
          name: 'bamboo',
          waterOccurance: 'monitor when the first 1 to 2 inches of soil becomes dry to damp, it’s time to water bamboo',
          lighting: 'filtered light',
          location: 'indoor'
        },
        {
          name: 'jade',
          about: 'Jade plant, a symbol of good luck, is a succulent plant with small pink or white flowers. It is native to South Africa and Mozambique, and is common as a houseplant worldwide. ',
          waterOccurence: 'allow to dry between waterings',
          lighting: 'put by a south or west window',
          location: 'indoor'
        },
        {
          name: 'spider plant',
          about: 'The spider plant is considered one of the most adaptable of houseplants and the easiest to grow. This plant can grow in a wide range of conditions and suffers from few problems, other than brown tips. The spider plant is so named because of its spider-like plants, or spiderettes, which dangle down from the mother plant like spiders on a web. Available in green or variegated varieties, these spiderettes often start out as small white flowers.',
          waterOccurence: 'Keep soil moist',
          lighting: 'indirect light',
          location: 'indoor'
        },
        {
          name: 'ivy',
          about: 'ivy is a genus of 12–15 species of evergreen climbing or ground-creeping woody plants in the family Araliaceae, native to western, central and southern Europe, Macaronesia, northwestern Africa and across central-southern Asia east to Japan and Taiwan.',
          waterOccurence: 'allow to dry between waterings',
          lighting: 'bright light',
          location: 'indoor'
        },
        {
          name: 'pothos',
          about: 'Indoors, the pothos plant usually confines itself to about six to 10 feet. Its leaves are bright and waxy with a noteworthy pointed heart shape, and are often green or variegated in white, yellow, or pale green. It is rare for them to flower or produce berries, especially indoors, but certain varietals can have tiny, petal-less white flowers that feature small berries.',
          waterOccurence: 'keep soil moist',
          lighting: 'adequate light',
          location: 'indoor'
        },
        {
          name: 'christmas cactus',
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

//Calling DynamoDB, sets
function setLastWater(plantName, lastWater){
    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "GDI-HackathonPlants";

    var params = {
        TableName:table,
        Item:{
            "Name": plantName,
            "LastWater": lastWater,
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
};

// Calling from DynamoDB, get
function getLastWater(plantName) {
//    var lastWaterDate = 0;
    var docClient = new AWS.DynamoDB.DocumentClient();

    var table = "GDI-HackathonPlants";
    var name = plantName;
    var params = {
        TableName:table,
        Key: {
          "Name": name,
        }
    };

    var promiseGet = new Promise((resolve,reject) => {
        docClient.get(params, function(err, plantObject) {
            if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null,2));
            } else{
              //console.log("getLastWater succeeded", JSON.stringify(plantObject));
              //console.log("lastWaterSec: ", plantObject.Item.LastWater);
              lastWaterSec = plantObject.Item.LastWater;
              resolve(lastWaterSec);
            }
        });
      });

        var lastWaterDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
        lastWaterDate.setUTCSeconds(lastWaterSec);
        return lastWaterDate;
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
    GetLastWaterIntentHandler,
    SetLastWaterIntentHandler,
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
