const https = require('https');
const axios = require('axios').default;

const dev = process.env.DEV;
const eventsUrl = process.env.EVENTS_URL;
const placesUrl = process.env.PLACES_URL;
const apiToken = process.env.API_TOKEN;

async function getPlaces() {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      const response = await axios.get(placesUrl, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      resolve(response.data.places);
    } catch (err) {
      resolve([]);
    }
  });
}

async function postEvent(place, events) {
  return new Promise(async (resolve) => {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: dev === '0' });
      await axios.post(eventsUrl, { place, events }, { httpsAgent, headers: { 'X-AUTH-TOKEN': apiToken } });
      resolve();
    } catch (err) {
      resolve();
    }
  });
}

module.exports = {
  getPlaces,
  postEvent,
}