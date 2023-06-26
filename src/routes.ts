import {Router} from 'express';
import { openAICtr } from './controller';

const router = Router();

export const OpenaiRouter = router
  .post('/openai', openAICtr)
