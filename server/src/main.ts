import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { json } from 'express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json());
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:4173',
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'dev-secret-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    }),
  );

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();
