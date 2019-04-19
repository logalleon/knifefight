import Express, { json } from 'express';
import config from './config';
import router from './router';
import bodyParser from 'body-parser';
import init from './router';
import dotenv from 'dotenv';

dotenv.config();

const app: Express.Application = Express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(config.PORT, async () => {
  console.log(`Listening on ${config.PORT} . . .`);
  app.use(init());
});