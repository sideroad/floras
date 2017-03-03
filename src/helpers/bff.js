import { proxy } from 'koiki';
import superagent from 'superagent';
import config from '../config';

export default function ({ app }) {
  proxy({
    app,
    protocol: 'https',
    host: config.googleapis.host,
    prefix: '/bff/google',
  });
  app.use('/bff/photos', (req, res) => {
    console.log(req.query);

    superagent
      .get('https://api.flickr.com/services/rest/')
      .query({
        method: 'flickr.photos.search',
        api_key: config.flickr.key,
        text: '桜',
        lat: req.query.lat,
        lon: req.query.lng,
        radius: 1,
        radius_units: 'km',
        extras: 'url_z,url_l',
        format: 'json',
        nojsoncallback: '1'
      })
      .end((error, json) => {
        if (error) {
          console.log(error);
          res.send({
            items: []
          });
          return;
        }
        console.log(json);
        res.send({
          items: json.body.photos.photo.map(item => ({
            id: item.id,
            title: item.title,
            thumbnail: item.url_z,
            image: item.url_l
          }))
        });
      });
  });
}
