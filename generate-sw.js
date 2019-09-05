const path = require('path');
const fs = require('fs');

const staticFileListPath = '.next/build-manifest.json';
const swOriginPath = 'static/sw-origin.js';
const swDistPath = 'static/sw-dist.js';
fs.exists(staticFileListPath, () => {
  console.log('Generating sw-dist.js...');

  const list = ['/offline'];
  const json = JSON.parse(fs.readFileSync(staticFileListPath));
  Object.keys(json.pages).forEach((route) => {
    json.pages[route].forEach((file) => {
      const cacheUrl = `/_next/${file}`;
      if (!list.includes(cacheUrl)) {
        list.push(cacheUrl);
      }
    });
  });
  const swOrigin = fs.readFileSync(swOriginPath, 'utf-8');
  const swDist = swOrigin.replace(/\/\*\* CACHE_TARGET_LIST \*\//g, JSON.stringify(list));
  console.log('Cache targets: ', JSON.stringify(list));

  fs.writeFile(swDistPath, swDist, (err) => {
    if (err) throw err;
    console.log('sw-dist.js file created successfully!');
  });
});
