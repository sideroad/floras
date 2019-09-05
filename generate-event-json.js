const request = require('superagent');
const fs = require('fs');
const cache = {};

function cachedRequest(apiUrl) {
  return new Promise((resolve) => {
    if (cache[apiUrl]) {
      console.log('matched with cache', apiUrl);
      resolve(cache[apiUrl]);
    } else {
      console.log('Not matched with cache', apiUrl);
      request(apiUrl).then((res) => {
        cache[apiUrl] = res;
        resolve(res);
      });
    }
  });
}
function getAll() {
  return cachedRequest(
    'https://chaus.herokuapp.com/apis/fs/events?limit=50000&fields=type,strength,latlng,day,name,place,id'
  )
    .then(res =>
      res.body.items.map(item => ({
        i: item.id,
        p: item.place,
        n: item.name,
        l: item.latlng,
        s: item.strength,
        d: item.day,
        t: item.type.id,
      }))
    )
    .catch(error => console.error(error));
}

getAll()
  .then(items => fs.writeFileSync(`${__dirname}/static/events.json`, JSON.stringify({ items })))
  .catch(error => console.error(error));
