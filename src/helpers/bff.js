import { proxy } from 'koiki';
import Twitter from 'twitter';
import config from '../config';

const client = new Twitter({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  bearer_token: config.twitter.bearerToken,
});
console.log(config.twitter);
export default function ({ app }) {
  proxy({
    app,
    protocol: 'https',
    host: config.googleapis.host,
    prefix: '/bff/google',
  });
  app.use('/bff/photos', (req, res) => {
    client.get('search/tweets', {
      q: '桜',
      geocode: `${req.query.lat},${req.query.lng},1km`,
      result_type: 'popular',
    }, (error, tweets) => {
      if (error) {
        res.send({
          items: []
        });
        return;
      }
      console.log(error);
      res.send(tweets);
    });
  });
}
