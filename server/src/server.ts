import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';

const app = express();

dotenv.config();

const origin = process.env.ORIGIN;
app.use(
  cors({
    origin,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_, res) => res.send('running'));
app.use('/api/auth', authRoutes);

let port = process.env.PORT;

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(async () => {
      console.log('databse initializing...');
    })
    .catch((error) => console.log(error));
});
