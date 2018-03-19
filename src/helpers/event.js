import jsdom from 'jsdom';
import request from 'superagent';
import fs from 'fs-extra';
import mapSeries from 'async/mapSeries';
import eachOfSeries from 'async/eachOfSeries';
import _ from 'lodash';
import moment from 'moment';
import path from 'path';
import url from 'url';
import bezier from 'bezier';
import querystring from 'querystring';
import config from '../config';

require('superagent-charset')(request);

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
  '沖縄県'
];

let queued = false;

const cache = {};

const cachedRequest = apiUrl =>
  new Promise((resolve) => {
    if (cache[apiUrl]) {
      resolve(cache[apiUrl]);
    } else {
      request(apiUrl).then((res) => {
        cache[apiUrl] = res;
        resolve(res);
      });
    }
  });

export function getTypes() {
  return cachedRequest('https://chaus.herokuapp.com/apis/fs/types?limit=100').then(res => res.body.items);
}

const getAll = () =>
  cachedRequest('https://chaus.herokuapp.com/apis/fs/events?limit=1000000').then(res =>
    res.body.items.map(item => ({ ...item, type: item.type.id }))
  );

const remove = ({ place, type }) =>
  request('DELETE', `https://chaus.herokuapp.com/apis/fs/events?place=${place}&type=${type}`);

export function get({ place, type }) {
  return request(`https://chaus.herokuapp.com/apis/fs/events?limit=1&place=${place}&type=${type}`).then(
    res => res.body.items.map(item => ({ ...item, type: item.type.id }))[0]
  );
}

const sites = {
  cherryblossom: (targetUrl, callback) => {
    if (!targetUrl || targetUrl.match(/^#/)) {
      callback();
      return;
    }
    const ba = querystring.parse(url.parse(targetUrl).query).ba;
    console.log(`# fetching ${targetUrl}`);
    request
      .get(`https://s.n-kishou.co.jp/w/sp/sakura/sakura_data.html?&type=map&ba=${ba}`)
      .set('Content-Type', 'application/json')
      .charset('shift_jis')
      .then(res =>
        JSON.parse(res.text).indexData.reduce(
          (acculator, value) => ({
            ...acculator,
            [value.code]: `${value.lat},${value.lon}`
          }),
          {}
        )
      )
      .then(master =>
        request
          .get(`https://s.n-kishou.co.jp/w/sp/sakura/sakura_data.html?&ba=${ba}`)
          .set('Content-Type', 'application/json')
          .charset('shift_jis')
          .then((res) => {
            const data = JSON.parse(res.text).fctresultData;
            return data
              .map(item => ({
                start: moment(item.kaika_date, 'YYYYMMDD').format('YYYY-MM-DD'),
                max: moment(item.mankai_date, 'YYYYMMDD').format('YYYY-MM-DD'),
                end: moment(item.mankai_date, 'YYYYMMDD')
                  .add(3, 'days')
                  .format('YYYY-MM-DD'),
                name: item.spot,
                latlng: master[item.code],
                pref: prefs[Number(ba) - 1]
              }))
              .filter(item => item.latlng);
          })
      )
      .then(spots => callback(null, spots));
  },
  fireworks: (targetUrl, callback) => {
    try {
      if (!targetUrl || targetUrl.match(/^#/)) {
        callback();
        return;
      }
      console.log(`# fetching ${targetUrl}`);
      jsdom.env({
        url: targetUrl,
        scripts: ['http://code.jquery.com/jquery.js'],
        done: (err, window) => {
          if (err) {
            callback();
            return;
          }
          const $ = window.$;
          const spots = $('.list01 a')
            .map((index, elem) => {
              const $this = $(elem);
              const dateMatched = $this
                .find('.search_result_date')
                .text()
                .match(/(\d\d\d\d)年(\d+)月(\d+)日/);
              const date = moment(`${dateMatched[1]}/${dateMatched[2]}/${dateMatched[3]}`, 'YYYY/M/D').format(
                'YYYY-MM-DD'
              );
              const shots = $this
                .find('.search_result_other_info_uchiage_num')
                .text()
                .match(/(\d+)?万?(\d+)発/);
              return {
                pref: '',
                title: $this.find('.search_result_spot_name').text(),
                name: $this.find('.search_result_spot_place').text(),
                start: date,
                max: date,
                end: date,
                link: `https://hanabi.walkerplus.com${$this.attr('href')}map.html`,
                strength: (shots ? Number(`${!shots[2] ? shots[1] * 10000 : shots[1]}${shots[2]}`) : 2000) / 50
              };
            })
            .get();

          mapSeries(
            spots,
            (spot, mapcallback) => {
              jsdom.env({
                url: spot.link,
                scripts: ['http://code.jquery.com/jquery.js'],
                done: (maperr, mapwindow) => {
                  if (maperr) {
                    mapcallback(maperr);
                    return;
                  }
                  const map$ = mapwindow.$;
                  const latlng = querystring
                    .parse(url.parse(map$('.detail_cont iframe').attr('src')).query)
                    .q.substr(1);
                  mapcallback(null, {
                    ...spot,
                    latlng
                  });
                }
              });
            },
            (_err, _spots) => {
              callback(_err, _spots);
            }
          );
        }
      });
    } catch (err) {
      callback();
    }
  },
  autumnleaves: (targetUrl, callback) => {
    if (!targetUrl || targetUrl.match(/^#/)) {
      callback();
      return;
    }
    console.log(`# fetching ${targetUrl}`);
    try {
      jsdom.env({
        url: targetUrl,
        scripts: ['http://code.jquery.com/jquery.js'],
        done: (err, window) => {
          if (err) {
            callback();
            return;
          }
          const $ = window.$;
          const spots = $('.segment')
            .map((index, item) => {
              const dates = $(item)
                .find('.data')
                .text()
                .replace('見ごろ予想：', '')
                .replace(/月上旬/g, '/5')
                .replace(/月中旬/g, '/15')
                .replace(/月下旬/g, '/25')
                .split('～');
              $(item)
                .find('.name span')
                .remove();
              const start = moment(`${moment().year()}/${dates[0]}`, 'YYYY/M/D');
              const end = moment(`${moment().year()}/${dates[1]}`, 'YYYY/M/D');
              return {
                name: _.trim(
                  $(item)
                    .find('.name')
                    .text()
                ),
                pref: _.trim(
                  $(item)
                    .find('.address')
                    .text()
                ),
                start: start.format('YYYY-MM-DD'),
                max: start.add(end.diff(start, 'days') / 2, 'days').format('YYYY-MM-DD'),
                end: end.format('YYYY-MM-DD')
              };
            })
            .get();
          callback(err, spots);
        }
      });
    } catch (err) {
      callback();
    }
  }
};

const crawl = (season, evaluator, type) =>
  new Promise((resolve) => {
    const famous = [{ name: '弘前公園' }, { name: '高遠城址公園' }, { name: '吉野山' }];
    const file = fs.readFileSync(path.resolve(__dirname, `../data/${season}-urls.txt`), 'utf-8');
    mapSeries(file.split('\n'), evaluator, (err, response) => {
      if (err) {
        queued = false;
        return;
      }
      const spots = _.compact(_.flatten(response));
      mapSeries(
        spots,
        (spot, callback) => {
          const query = `${spot.pref} ${spot.name}`;
          console.log(`# fetch ${query} in google place API`);
          request
            .get(
              `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${
                config.googleapis.key
              }&language=ja`
            )
            .end((fetchError, json) => {
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
                const max = moment(spot.max, 'YYYY-MM-DD').dayOfYear();
                const end = moment(spot.end, 'YYYY-MM-DD').dayOfYear();
                const place = json.body.results[0].place_id;
                const name = spot.title || json.body.results[0].name;
                const latlng = `${location.lat},${location.lng}`;
                const popurarity = spot.popurarity || _.find(famous, { name }) ? 9 : 4;

                const strengths = spot.strength
                  ? [spot.strength]
                  : [].concat(
                      0,
                      _.times(max - start + 1, index => index / (max - start) * 9),
                      _.times(end - max, index => 9 - index / (end - max) * 9),
                      0
                    );
                request
                  .post(`https://translation.googleapis.com/language/translate/v2?key=${config.googleapis.key}`)
                  .send({
                    q: [name],
                    target: 'en'
                  })
                  .end((translateError, translated) => {
                    if (fetchError) {
                      console.error('# translate error: ', err);
                      setTimeout(() => callback(), 100);
                    } else if (!translated.body.data.translations.length) {
                      console.log(`# translate error: ${spot.name} does not found in translation API`);
                      setTimeout(() => callback(), 100);
                    } else {
                      const translatedName = translated.body.data.translations[0].translatedText;
                      console.log(`# translate success: req[${name}] res[${translatedName}]`);
                      remove({ place, type: type.id }).then(() => {
                        eachOfSeries(
                          strengths,
                          (strength, index, eachOfCallback) => {
                            request
                              .post('https://chaus.herokuapp.com/apis/fs/events')
                              .send({
                                ...spot,
                                place,
                                name: translatedName,
                                latlng: spot.latlng || latlng,
                                day: start + index,
                                strength: bezier(strengths, 1 / (strengths.length * (index + 1))),
                                popurarity,
                                type: type.id
                              })
                              .set('Accept', 'application/json')
                              .end(() => eachOfCallback());
                          },
                          () => {
                            callback();
                          }
                        );
                      });
                    }
                  });
              }
            });
        },
        () => {
          queued = false;
          resolve();
        }
      );
    });
  });

export default function ({ app }) {
  app.get('/events', (req, res) => {
    getAll().then(items => res.send({ items }));
  });
  app.get('/trends', (req, res) => {
    if (req.query.place) {
      getTypes().then((types) => {
        getAll().then((items) => {
          const type = _.find(types, { id: req.query.type });
          res.send({
            items: items.filter(item => item.place === req.query.place && item.type === type.id).map(item => ({
              name: item.name,
              day: item.day,
              date: moment()
                .dayOfYear(item.day)
                .format('YYYY-MM-DD'),
              [item.type]: item.strength,
              type: item.type,
              strength: item.strength
            }))
          });
        });
      });
    } else {
      getTypes().then((types) => {
        const defaults = types.reduce(
          (reduced, type) => ({
            ...reduced,
            [type.id]: 0
          }),
          {}
        );
        getAll().then((items) => {
          const [nelat, nelng] = (req.query.ne || '').split(',').map(num => Number(num));
          const [swlat, swlng] = (req.query.sw || '').split(',').map(num => Number(num));
          const trends = _.times(365, index => ({
            day: index + 1,
            date: moment()
              .dayOfYear(index + 1)
              .format('YYYY-MM-DD'),
            strength: 0,
            ...defaults
          }));

          items.forEach((item) => {
            const day = _.find(trends, { day: item.day });
            const [lat, lng] = item.latlng.split(',').map(num => Number(num));
            if (day && lat <= nelat && lat >= swlat && lng <= nelng && lng >= swlng) {
              day[item.type] += item.strength;
              day.type = item.type;
              day.strength += item.strength;
            }
          });

          res.send({
            items: trends
          });
        });
      });
    }
  });
  app.get('/events-crawler', (req, res) => {
    if (queued) {
      res.send({ msg: 'already queued' });
      return;
    }
    queued = true;
    res.send({ msg: 'crawling started' });
    getTypes().then((types) => {
      types.map(item => crawl(item.name, sites[item.name], item));
    });
  });
}
