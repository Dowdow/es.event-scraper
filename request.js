const fs = require('fs');
const https = require('https');
const axios = require('axios').default;
const FormData = require('form-data');

const dev = process.env.DEV;

const getEventsUrl = process.env.GET_EVENTS_URL;
const getPlacesUrl = process.env.GET_PLACES_URL;
const postEventUrl = process.env.POST_EVENT_URL;
const postEventImageUrl = process.env.POST_EVENT_IMAGE_URL;
const postEventsUrl = process.env.POST_EVENTS_URL;

const apiToken = process.env.API_TOKEN;

async function getEvents() {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.get(getEventsUrl, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      resolve(response.data.events);
    } catch (err) {
      console.log(err.message);
      resolve([]);
    }
  });
}

async function getPlaces() {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.get(getPlacesUrl, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      resolve(response.data.places);
    } catch (err) {
      console.log(err.message);
      resolve([]);
    }
  });
}

async function postEvent(facebookId, dates, title) {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.post(postEventUrl, { facebookId, dates, title }, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      console.log(response.data);
      resolve();
    } catch (err) {
      console.log(err.message);
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
      console.log(response.data);
      resolve();
    } catch (err) {
      console.log(err.message);
      resolve();
    }
  });
}

async function postEvents(place, events) {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.post(postEventsUrl, { place, events }, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      console.log(response.data);
      resolve();
    } catch (err) {
      console.log(err.message);
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