require('dotenv').config();
const puppeteer = require('puppeteer');
const { autoScrollUpcomingEvents, retrieveEventsData, setLanguage } = require('./evaluate');
const { getPuppeteerOptions } = require('./puppeteer');
const { getArtists, postEventsArtist } = require('./request');

(async () => {
  const artists = await getArtists();

  if (artists.length === 0) {
    return;
  }

  const options = getPuppeteerOptions();
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();
  await setLanguage(page);

  await page.goto(`https://facebook.com`);

  const cookieButtonSelector = 'button[data-cookiebanner="accept_only_essential_button"]';
  await page.waitForSelector(cookieButtonSelector);
  await page.click(cookieButtonSelector);
  await page.waitForTimeout(1000);

  for (const a of artists) {
    await page.goto(`https://facebook.com/pg/${a.facebookId}/events`);
    await page.waitForSelector('div[id="upcoming_events_card"]');
    await page.waitForTimeout(1000);
    await autoScrollUpcomingEvents(page);
    const events = await retrieveEventsData(page);
    if (events.length > 0) {
      await postEventsArtist(a.id, events);
    }
  }

  await browser.close();
})();
