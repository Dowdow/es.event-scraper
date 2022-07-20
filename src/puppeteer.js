const prod = process.env.PROD === '1';

function getPuppeteerOptions() {
  const options = {
    headless: prod,
  };

  if (prod) {
    options.executablePath = '/usr/bin/chromium-browser';
  }

  return options;
}

module.exports = {
  getPuppeteerOptions,
};