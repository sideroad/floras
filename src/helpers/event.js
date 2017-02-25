import jsdom from 'jsdom';
import request from 'superagent';
import fs from 'fs-extra';
import mapSeries from 'async/mapSeries';
import _ from 'lodash';
import moment from 'moment';
import path from 'path';
import redis from 'redis';
import config from '../config';

const client = redis.createClient(process.env.REDISCLOUD_URL, { no_ready_check: true });

const CHERRY_BLOSSOM = '105ec6d';
const file = fs.readFileSync(path.resolve(__dirname, '../data/sakura-urls.txt'), 'utf-8');
const famous = [
  { name: '弘前公園' },
  { name: '高遠城址公園' },
  { name: '吉野山' }
];
const prefs = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

let queued = false;
export default function ({ app }) {
  app.get('/events', (req, res) => {
    client.get('sakura', (err, json) => {
      res.send(JSON.parse(json || '{"items":[]}'));
    });
  });
  app.get('/events-crawler', (req, res) => {
    if (queued) {
      res.send({ msg: 'already queued' });
      return;
    }
    queued = true;
    res.send({ msg: 'crawling started' });
    let prefIndex = 0;
    mapSeries(file.split('\n'), (url, callback) => {
      if (!url || url.match(/^#/)) {
        callback();
        return;
      }
      console.log(`# fetching ${url}`);
      jsdom.env({
        url,
        scripts: ['http://code.jquery.com/jquery.js'],
        done: (err, window) => {
          const $ = window.$;
          const spots = $('.cw-in.mb10 > h3.mt20.sttl').map((index, item) => ({
            name: $(item).text(),
            pref: prefs[prefIndex]
          })).get();
          const dates = $('.tbl01.mb10').map((index, table) => ({
            start: $(table).find('tr:eq(1) td:eq(0)').text(),
            end: $(table).find('tr:eq(1) td:eq(1)').text(),
          })).get();
          prefIndex += 1;
          callback(err, _.merge(spots, dates));
        }
      });
    }, (err, response) => {
      if (err) {
        queued = false;
        return;
      }
      const spots = _.compact(_.flatten(response));
      mapSeries(spots, (spot, callback) => {
        const query = `${spot.pref} ${spot.name}`;
        console.log(`# fetch ${query} in google place API`);
        request
          .get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${config.googleapis.key}&language=ja`)
          .end(
            (fetchError, json) => {
              if (fetchError) {
                console.error('# fetch error: ', err);
                setTimeout(() => callback(), 100);
              } else if (!json.body.results.length) {
                console.log(`# fetch error: ${spot.name} does not found in place API`);
                setTimeout(() => callback(), 100);
              } else {
                console.log(`# fetch success: req[${spot.name}] res[${json.body.results[0].name}]`);
                const location = json.body.results[0].geometry.location;
                const start = moment(`${moment().year()}/${spot.start}`, 'YYYY/M/D').dayOfYear();
                const end = moment(`${moment().year()}/${spot.end}`, 'YYYY/M/D').dayOfYear();
                const type = CHERRY_BLOSSOM;
                const events = [];
                const id = json.body.results[0].place_id;
                const name = json.body.results[0].name;
                const latlng = `${location.lat},${location.lng}`;
                const popurarity = _.find(famous, { name }) ? 9 : 4;
                _.times((end - start) + 1, (index) => {
                  events.push({
                    ...spot,
                    id,
                    name,
                    latlng,
                    day: start + index,
                    strength: (index / (end - start)) * 9,
                    popurarity,
                    type
                  });
                });
                _.times(3, (index) => {
                  events.push({
                    ...spot,
                    id,
                    name,
                    latlng,
                    day: end + index + 1,
                    strength: 9 / (index + 1),
                    popurarity,
                    type
                  });
                });
                callback(err, events);
              }
            }
          );
      }, (fetchError, json) => {
        queued = false;
        const events = _.compact(_.flatten(json));
        client.set('sakura', JSON.stringify({ items: events }));
      });
    });
  });
}
