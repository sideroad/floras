import jsdom from 'jsdom';
import request from 'superagent';
import fs from 'fs-extra';
import mapSeries from 'async/mapSeries';
import concat from 'async/concat';
import _ from 'lodash';
import moment from 'moment';
import path from 'path';
import redis from 'redis';
import config from '../config';
import constants from '../constants';

const client = redis.createClient(process.env.REDISCLOUD_URL, { no_ready_check: true });

const TYPES = {
  sakura: '105ec6d',
  leaves: '7c03578',
};
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

const getAll = () =>
  new Promise((resolve, reject) => {
    concat(['sakura', 'leaves'], (season, callback) => {
      client.get(season, (err, json) => {
        const events = JSON.parse(json || '{"items":[]}').items;
        callback(err, events);
      });
    }, (err, json) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(json);
    });
  });


export function get({ id, day }) {
  const conditions = {
    id
  };
  if (day) {
    conditions.day = Number(day);
  }
  return getAll()
    .then(
      events =>
        _.find(events, conditions) || { type: TYPES.sakura }
    );
}

const leaves = (url, callback) => {
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
      const spots = $('.segment').map((index, item) => {
        const dates = $(item).find('.data')
                             .text()
                             .replace('見ごろ予想：', '')
                             .replace(/月上旬/g, '/5')
                             .replace(/月中旬/g, '/15')
                             .replace(/月下旬/g, '/25')
                             .split('～');
        $(item).find('.name span').remove();
        return {
          name: $(item).find('.name').text(),
          pref: '',
          start: moment(`${moment().year()}/${dates[0]}`, 'YYYY/M/D').format('YYYY-MM-DD'),
          end: moment(`${moment().year()}/${dates[1]}`, 'YYYY/M/D').format('YYYY-MM-DD'),
        };
      })
      .get();
      callback(err, spots);
    }
  });
};

const sakura = (data, callback) => {
  const [prefIndex, url] = data.split(',');

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
      const spots = $('.set-in').map((index, item) => ({
        name: $(item).text(),
        pref: prefs[prefIndex]
      })).get();
      const dates = $('.tbl01.mb10').map((index, table) => ({
        start: moment(`${moment().year()}/${$(table).find('tr:eq(1) td:eq(0)').text()}`, 'YYYY/M/D').format('YYYY-MM-DD'),
        end: moment(`${moment().year()}/${$(table).find('tr:eq(1) td:eq(1)').text()}`, 'YYYY/M/D').format('YYYY-MM-DD'),
      })).get();
      callback(err, _.merge(spots, dates));
    }
  });
};

const crawl = (season, evaluator) =>
  new Promise((resolve) => {
    const famous = [
      { name: '弘前公園' },
      { name: '高遠城址公園' },
      { name: '吉野山' }
    ];
    const file = fs.readFileSync(path.resolve(__dirname, `../data/${season}-urls.txt`), 'utf-8');
    mapSeries(file.split('\n'), evaluator, (err, response) => {
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
                const start = moment(spot.start, 'YYYY-MM-DD').dayOfYear();
                const end = moment(spot.end, 'YYYY-MM-DD').dayOfYear();
                const type = TYPES[season];
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
                    type,
                    color: constants[type].color,
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
                    type,
                    color: constants[type].color,
                  });
                });
                callback(err, events);
              }
            }
          );
      }, (fetchError, json) => {
        queued = false;
        const events = _.compact(_.flatten(json));
        client.set(season, JSON.stringify({ items: events }));
        resolve();
      });
    });
  });

export default function ({ app }) {
  app.get('/events', (req, res) =>
    getAll()
      .then(items => res.send({ items }))
  );
  app.get('/events-crawler', (req, res) => {
    if (queued) {
      res.send({ msg: 'already queued' });
      return;
    }
    queued = true;
    res.send({ msg: 'crawling started' });
    crawl('sakura', sakura);
    crawl('leaves', leaves);
  });
}
