import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Strip /api prefix if forwarded from Vercel Services rewrites (/api/* -> backend)
  app.use((req: any, res: any, next: any) => {
    if (req.url && req.url.startsWith('/api/')) {
      req.url = req.url.substring(4);
    } else if (req.url === '/api') {
      req.url = '/';
    }
    next();
  });

  // Increase payload limit to 20MB for image uploads and base64 assets
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend is running on http://0.0.0.0:${port}`);
}
bootstrap();
