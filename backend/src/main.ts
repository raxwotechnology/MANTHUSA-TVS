import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as http from 'http';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3001;
  try {
    const app = await NestFactory.create(AppModule);
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.disable('x-powered-by');

    // Security headers middleware
    app.use((_req: any, res: any, next: any) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      next();
    });

    // Strip /api prefix if forwarded from rewrites/proxies (/api/* -> backend)
    app.use((req: any, _res: any, next: any) => {
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

    // Dynamic CORS to support Netlify, Render, Localhost and Custom Domains with credentials
    app.enableCors({
      origin: true,
      credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.listen(port, '0.0.0.0');
    console.log(`Backend is running on http://0.0.0.0:${port}`);
  } catch (err: any) {
    console.error('CRITICAL: NestJS bootstrap failed:', err);
    const fallbackServer = http.createServer((_req, res) => {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(
        JSON.stringify({
          statusCode: 500,
          error: 'NestJS Bootstrap Failure',
          message: err?.message || String(err),
          stack: err?.stack,
        }),
      );
    });
    fallbackServer.listen(port, () => {
      console.log(`Fallback server running on port ${port} reporting error`);
    });
  }
}

bootstrap().catch((err) => {
  console.error('Fatal unhandled bootstrap error:', err);
});
