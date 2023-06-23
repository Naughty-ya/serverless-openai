import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { handler } from './src/openaiHandler';

const PORT = 3000;
const app = express();

app.use(express.json());

// health check
app.get('/', async (req: Request, res: Response) => {
  res.send('Ok.');
});

// handler test
app.post('/openai', async (req: Request & APIGatewayEvent, res: Response & Context, next: NextFunction) => {
  try {
    const result = await handler(req, res);
    if (result.statusCode !== 200) {
      throw new Error(JSON.parse(result.body));
    }
    res.status(200).json({
      success : true,
      data : result.body,
    });
  } catch (err) {
    next(err);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(JSON.parse(err));
  res.send(JSON.parse(err));
});

app.listen(PORT, () => console.log('Listening on port ' + PORT));
