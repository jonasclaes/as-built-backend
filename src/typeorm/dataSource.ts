import 'dotenv/config';

import { DataSource } from 'typeorm';
import ormConfig from './orm.config';

const dataSource = new DataSource({
  ...ormConfig,
  url: process.env.DATABASE_URL,
});

export default dataSource;
