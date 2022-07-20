require('dotenv').config();
const puppeteer = require('puppeteer');
const { retrieveEventData, setLanguage } = require('./evaluate');
const { getPuppeteerOptions } = require('./puppeteer');
const { getEvents, postEvent, postEventImage } = require('./request');

(async () => {
  const events = await getEvents();

  if (events.length === 0) {
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

  for (const e of events) {
    await page.goto(`https://facebook.com/events/${e.facebookId}`);
    await page.waitForSelector('h2 span[class=""]');
    await page.waitForTimeout(1000);
    const { dates, title, image } = await retrieveEventData(page);
    if (dates !== null && title !== null) {
      await postEvent(e.facebookId, dates, title);
    }
    if (image !== null) {
      await postEventImage(e.facebookId, image);
    }
  }

  await browser.close();
})();
