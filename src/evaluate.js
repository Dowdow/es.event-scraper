async function setPageLanguage(page) {
  return await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'language', {
      get: function () {
        return 'fr-FR';
      }
    });
    Object.defineProperty(navigator, 'languages', {
      get: function () {
        return ['fr-FR', 'fr'];
      }
    });
  });
}

async function retrieveEventData(page) {
  return await page.evaluate(async () => {
    return await new Promise((resolve) => {
      const data = {
        dates: null,
        image: null,
        title: null,
      };
      const datesElement = document.querySelector('span[class*="jdix4yx3"], span[class*="erlsw9ld"]');
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
      if (upcomingEventsDiv === null) {
        resolve();
      }
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

module.exports = {
  setPageLanguage,
  retrieveEventData,
  retrieveEventsData,
  autoScrollUpcomingEvents,
}