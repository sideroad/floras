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
        tags: '桜',
        lat: req.query.lat,
        lon: req.query.lng,
        radius: 0.5,
        radius_units: 'km',
        extras: 'url_z,url_l',
        format: 'json',
        media: 'photos',
        nojsoncallback: '1'
      })
      .end((error, json) => {
        if (error ||
            !json.body.photos ||
            !json.body.photos.photo
          ) {
          console.log(error);
          res.send({
            items: []
          });
          return;
        }
        res.send({
          items: json.body.photos.photo.map(item => ({
            id: item.id,
            title: item.title,
            thumbnail: item.url_z,
            image: item.url_l
          })).filter(item => item.thumbnail && item.image)
        });
      });
  });
}
