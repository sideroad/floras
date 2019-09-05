import express from 'express';
import cors from 'cors';
import bffPhotos from './server/bff-photos';
import bffProxy from './server/bff-proxy';
import eventsCrawler from './server/events-crawler';
import trend from './server/trend';
import config from './config';

const app = express();
app.use(cors());
app.use('/trends', trend);
app.use('/events-crawler', eventsCrawler);
app.use('/bff/photos', bffPhotos);
app.use('/bff/google/maps/api/place/', bffProxy);

app.listen(config.port);
