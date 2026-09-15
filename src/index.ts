import express, { Request, Response } from 'express';
import { env } from './infrastructure/config/env';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});