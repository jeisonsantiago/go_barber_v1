import "reflect-metadata";
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import routes from './routes';
import '../typeorm';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppErrors';
import cors from 'cors';
import { errors } from 'celebrate';
import '@shared/infra/typeorm';
import '@shared/container'; // injection module
import rateLimiter from 'shared/infra/http/middlewares/rateLimiter';

const app = express();

app.use(rateLimiter);
app.use(cors());
// app.use(cors({
//   origin: 'http//localhost/3000'
// })); // cors lib blocks other sites access to this API

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

// error treatment has to be set after app.use(routes)
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  //console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })

})

app.listen(3333, () => {
  console.log('Server starterd on port: 3333');
});
