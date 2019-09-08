import { getTypes, getAll, crawl } from '../helpers/event';

let queued = false;
export default (req, res) => {
  if (queued) {
    res.send({ msg: 'already queued' });
    return;
  }
  queued = true;
  res.send({ msg: 'crawling started' });
  getTypes().then((types) => {
    types.map(item => crawl(item.name, sites[item.name], item));
  });
};
