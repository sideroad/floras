import superagent from 'superagent';
import _ from 'lodash';
import config from '../../../config';
import { get, getTypes } from '../../../helpers/event';

export default (req, res) => {
  getTypes().then(types =>
    get({ place: req.query.place, type: req.query.type }).then((event) => {
      Promise.all([
        superagent.get('https://api.flickr.com/services/rest/').query({
          method: 'flickr.photos.licenses.getInfo',
          api_key: config.flickr.key,
          format: 'json',
          nojsoncallback: 1,
        }),
        superagent.get('https://api.flickr.com/services/rest/').query({
          method: 'flickr.photos.search',
          api_key: config.flickr.key,
          tags: _.find(types, { id: event.type }).tag,
          lat: req.query.lat,
          lon: req.query.lng,
          radius: 1,
          radius_units: 'km',
          extras: 'owner_name,url_z,url_l,license',
          format: 'json',
          media: 'photos',
          nojsoncallback: '1',
        }),
      ])
        .then((responses) => {
          console.log(responses, config.flickr.key);
          const [licenses, photos] = responses;
          if (!photos.body.photos || !photos.body.photos.photo) {
            res.send({
              items: [],
            });
            return;
          }
          res.send({
            items: photos.body.photos.photo
              .map(item => ({
                id: item.id,
                title: item.title,
                url: `https://www.flickr.com/photos/${item.owner}/${item.id}`,
                owner: item.ownername,
                thumbnail: item.url_z,
                image: item.url_l,
                license: _.find(licenses.body.licenses.license, { id: item.license }),
              }))
              .filter(item => item.thumbnail && item.image),
          });
        })
        .catch((error) => {
          console.log(error);
          res.send({ items: [] });
        });
    })
  );
};
