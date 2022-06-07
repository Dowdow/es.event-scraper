require('dotenv').config();
const puppeteer = require('puppeteer');
const { getEvents, postEvent, postEventImage } = require('./request');

const dev = process.env.DEV;

(async () => {
  const events = await getEvents();

  if (events.length === 0) {
    return;
  }

  console.log(events);

  const browser = await puppeteer.launch({ headless: dev === '0' });
  const page = await browser.newPage();

  await page.goto(`https://facebook.com`);

  const cookieButtonSelector = 'button[data-cookiebanner="accept_only_essential_button"]';
  await page.waitForSelector(cookieButtonSelector);
  await page.click(cookieButtonSelector);
  await page.waitForTimeout(1000);

  for (const e of events) {
    await page.goto(`https://facebook.com/events/${e.facebookId}`);
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

async function retrieveEventData(page) {
  return await page.evaluate(async () => {
    return await new Promise((resolve) => {
      const data = {
        dates: null,
        image: null,
        title: null,
      };
      const datesElement = document.querySelector('h2 span[class*="jdix4yx3"], h2 span[class*="erlsw9ld"]');
      if (datesElement) {
        data.dates = datesElement.innerText;
      }
      const imageElement = document.querySelector('img[data-imgperflogname]');
      if (imageElement) {
        data.image = imageElement.src;
      }
      const titleElement = document.querySelector('h2 span[class=""]');
      if (titleElement) {
        data.title = titleElement.innerText;
      }

      resolve(data);
    });
  })
}