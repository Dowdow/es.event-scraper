require('dotenv').config();
const puppeteer = require('puppeteer');
const { autoScrollUpcomingEvents, retrieveEventsData, setLanguage } = require('./evaluate');
const { getPuppeteerOptions } = require('./puppeteer');
const { getPlaces, postEventsPlace } = require('./request');

(async () => {
  const places = await getPlaces();

  if (places.length === 0) {
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

  for (const p of places) {
    await page.goto(`https://facebook.com/pg/${p.facebookId}/events`);
    await page.waitForSelector('div[id="upcoming_events_card"]');
    await page.waitForTimeout(1000);
    await autoScrollUpcomingEvents(page);
    const events = await retrieveEventsData(page);
    if (events.length > 0) {
      await postEventsPlace(p.id, events);
    }
  }

  await browser.close();
})();
