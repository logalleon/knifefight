import Express from 'express';
import config from './config';
import router from './router';
import bodyParser from 'body-parser';
import Sequelize from 'sequelize';
import init from './router';
import dotenv from 'dotenv';

dotenv.config();

const app: Express.Application = Express();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(config.PORT, async () => {
  console.log(`Listening on ${config.PORT} . . .`);
  app.use(init());
});