import express, { Request, Response } from 'express';
import { env } from './infrastructure/config/env';
import { authRoutes } from './infrastructure/http/routes/auth.routes';
import { categoryRoutes } from './infrastructure/http/routes/category.routes';
import { listingRoutes } from './infrastructure/http/routes/listing.routes';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/listings', listingRoutes);

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});