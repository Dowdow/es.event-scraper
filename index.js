require('dotenv').config();
const puppeteer = require('puppeteer');
const { getPlaces, postEvent } = require('./request');

const dev = process.env.DEV;

(async () => {
  const places = await getPlaces();

  if (places.length === 0) {
    return;
  }

  const browser = await puppeteer.launch({ headless: dev === '0' });
  const page = await browser.newPage();

  await page.goto(`https://facebook.com`);

  const cookieButtonSelector = 'button[data-cookiebanner="accept_only_essential_button"]';
  await page.waitForSelector(cookieButtonSelector);
  await page.click(cookieButtonSelector);
  await page.waitForTimeout(1000);

  for (const p of places) {
    await page.goto(`https://facebook.com/pg/${p.facebookId}/events`);
    await page.waitForTimeout(1000);
    await autoScrollUpcomingEvents(page);
    const events = await retrieveEventsData(page);
    await postEvent(p.id, events);
  }

  await browser.close();
})();

async function retrieveEventsData(page) {
  return await page.evaluate(async () => {
    return await new Promise((resolve) => {
      const events = [];
      const aElements = document.querySelectorAll('div[id="upcoming_events_card"] a[href^="/events"]');
      for (const a of aElements) {
        events.push({
          name: a.textContent.trim(),
          facebookId: a.getAttribute('href').split('/')[2],
        })
      }
      resolve(events);
    });
  })
}

async function autoScrollUpcomingEvents(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const upcomingEventsDiv = document.getElementById('upcoming_events_card');
      let divHeigth = upcomingEventsDiv.scrollHeight;
      let sameHeigthTimes = 0;

      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        const newHeigth = upcomingEventsDiv.scrollHeight;
        if (newHeigth === divHeigth) {
          sameHeigthTimes += 1;
        } else {
          divHeigth = newHeigth;
          sameHeigthTimes = 0;
        }

        if (totalHeight >= scrollHeight - window.innerHeight || sameHeigthTimes >= 15) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
}