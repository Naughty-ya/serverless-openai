import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { OpenaiRouter } from './src/routes';

const app = express();

app.use(express.json());
app.use(cors());

// health check
app.get('/', async (req: Request, res: Response) => {
  res.status(200).send('Ok.');
});

app.use('/api', OpenaiRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(200).json({
    success: false,
    message: err.message,
  })
  next();
});

app.listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));
