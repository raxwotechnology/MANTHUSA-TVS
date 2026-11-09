import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response, json, urlencoded } from 'express';

const server = express();

server.use((req: any, res: any, next: any) => {
  if (req.url && req.url.startsWith('/api/')) {
    req.url = req.url.substring(4);
  } else if (req.url === '/api') {
    req.url = '/';
  }
  next();
});

server.use(json({ limit: '20mb' }));
server.use(urlencoded({ extended: true, limit: '20mb' }));

let isReady = false;
let initPromise: Promise<void> | null = null;

async function bootstrap() {
  if (isReady) return;
  if (!initPromise) {
    initPromise = (async () => {
      const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
      app.enableCors({
        origin: true,
        credentials: true,
      });
      app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
      await app.init();
      isReady = true;
    })().catch((err) => {
      initPromise = null;
      console.error('NestJS bootstrap error in handler:', err);
      throw err;
    });
  }
  await initPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    await bootstrap();
    server(req, res);
  } catch (err: any) {
    console.error('Vercel handler execution error:', err);
    res.status(500).json({
      statusCode: 500,
      error: 'Backend handler error',
      message: err?.message || String(err),
    });
  }
}

// Also support module.exports for CommonJS loaders
module.exports = handler;
module.exports.default = handler;

// If started directly via node
if (require.main === module || process.env.RUN_STANDALONE === 'true') {
  bootstrap().then(() => {
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  });
}
