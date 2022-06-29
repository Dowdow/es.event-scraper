const https = require('https');
const axios = require('axios').default;
const FormData = require('form-data');
const winston = require('winston');

const dev = process.env.DEV;

const getEventsUrl = process.env.GET_EVENTS_URL;
const getPlacesUrl = process.env.GET_PLACES_URL;
const postEventUrl = process.env.POST_EVENT_URL;
const postEventImageUrl = process.env.POST_EVENT_IMAGE_URL;
const postEventsUrl = process.env.POST_EVENTS_URL;

const apiToken = process.env.API_TOKEN;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'request.log' }),
  ],
});

async function getEvents() {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.get(getEventsUrl, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `GET Events - ${response.data.events.length} events`);
      resolve(response.data.events);
    } catch (err) {
      logger.log('error', `GET Events - ${err.message}`);
      resolve([]);
    }
  });
}

async function getPlaces() {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.get(getPlacesUrl, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `GET Places - ${response.data.places.length} places`);
      resolve(response.data.places);
    } catch (err) {
      logger.log('error', `GET Places - ${err.message}`);
      resolve([]);
    }
  });
}

async function postEvent(facebookId, dates, title) {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.post(postEventUrl, { facebookId, dates, title }, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `POST Event - facebookId:${facebookId} - ${response.data.message}`);
      resolve();
    } catch (err) {
      logger.log('error', `POST Event - ${err.message}`);
      resolve();
    }
  });
}

async function postEventImage(facebookId, imageUrl) {
  return new Promise(async (resolve) => {
    try {
      const responseStream = await axios.get(imageUrl, { responseType: 'stream' });

      const form = new FormData();
      form.append('file', responseStream.data);

      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.post(postEventImageUrl.replace(':id', facebookId), form, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken, ...form.getHeaders() } });
      logger.log('info', `POST Event Image - facebookId:${facebookId} - ${response.data.image}`);
      resolve();
    } catch (err) {
      logger.log('error', `POST Event Image - ${err.message}`);
      resolve();
    }
  });
}

async function postEvents(place, events) {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.post(postEventsUrl, { place, events }, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `POST Events - placeId:${place} - ${response.data.added} events added`);
      resolve();
    } catch (err) {
      logger.log('error', `POST Events - ${err.message}`);
      resolve();
    }
  });
}

module.exports = {
  getEvents,
  getPlaces,
  postEvent,
  postEventImage,
  postEvents,
}