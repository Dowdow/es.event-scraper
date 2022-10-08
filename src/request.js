const https = require('https');
const axios = require('axios');
const FormData = require('form-data');
const winston = require('winston');

const prod = process.env.PROD === '1';

const getArtistsUrl = process.env.GET_ARTISTS_URL;
const getEventsUrl = process.env.GET_EVENTS_URL;
const getPlacesUrl = process.env.GET_PLACES_URL;
const getPlannersUrl = process.env.GET_PLANNERS_URL;
const postEventUrl = process.env.POST_EVENT_URL;
const postEventImageUrl = process.env.POST_EVENT_IMAGE_URL;
const postEventsArtistUrl = process.env.POST_EVENTS_ARTIST_URL;
const postEventsPlaceUrl = process.env.POST_EVENTS_PLACE_URL;
const postEventsPlannerUrl = process.env.POST_EVENTS_PLANNER_URL;

const apiToken = process.env.API_TOKEN;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'request.log' }),
  ],
});

async function getArtists() {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: prod });
      const response = await axios.get(getArtistsUrl, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `GET Artists - ${response.data.artists.length} artists`);
      resolve(response.data.artists);
    } catch (err) {
      logger.log('error', `GET Artists - ${err.message}`);
      resolve([]);
    }
  });
}

async function getEvents() {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: prod });
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
      const httpsAgent = new https.Agent({ rejectUnauthorized: prod });
      const response = await axios.get(getPlacesUrl, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `GET Places - ${response.data.places.length} places`);
      resolve(response.data.places);
    } catch (err) {
      logger.log('error', `GET Places - ${err.message}`);
      resolve([]);
    }
  });
}

async function getPlanners() {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: prod });
      const response = await axios.get(getPlannersUrl, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `GET Planners - ${response.data.planners.length} planners`);
      resolve(response.data.planners);
    } catch (err) {
      logger.log('error', `GET Planners - ${err.message}`);
      resolve([]);
    }
  });
}

async function postEvent(facebookId, dates, title) {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: prod });
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

      const httpsAgent = new https.Agent({ rejectUnauthorized: prod });
      const response = await axios.post(postEventImageUrl.replace(':id', facebookId), form, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken, ...form.getHeaders() } });
      logger.log('info', `POST Event Image - facebookId:${facebookId} - ${response.data.image}`);
      resolve();
    } catch (err) {
      logger.log('error', `POST Event Image - ${err.message}`);
      resolve();
    }
  });
}

async function postEventsArtist(artist, events) {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: prod });
      const response = await axios.post(postEventsArtistUrl, { artist, events }, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `POST Events Artist - artistId:${artist} - ${response.data.added} events added`);
      resolve();
    } catch (err) {
      logger.log('error', `POST Events Artist - ${err.message}`);
      resolve();
    }
  });
}

async function postEventsPlace(place, events) {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: prod });
      const response = await axios.post(postEventsPlaceUrl, { place, events }, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `POST Events Place - placeId:${place} - ${response.data.added} events added`);
      resolve();
    } catch (err) {
      logger.log('error', `POST Events Place - ${err.message}`);
      resolve();
    }
  });
}

async function postEventsPlanner(planner, events) {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: prod });
      const response = await axios.post(postEventsPlannerUrl, { planner, events }, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      logger.log('info', `POST Events Planner - plannerId:${planner} - ${response.data.added} events added`);
      resolve();
    } catch (err) {
      logger.log('error', `POST Events Planner - ${err.message}`);
      resolve();
    }
  });
}

module.exports = {
  getArtists,
  getEvents,
  getPlaces,
  getPlanners,
  postEvent,
  postEventImage,
  postEventsArtist,
  postEventsPlace,
  postEventsPlanner,
};