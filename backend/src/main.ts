import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
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

  // Increase payload limit to 20MB for image uploads and base64 assets
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));

  const rawOrigin = process.env.FRONTEND_ORIGIN;
  const allowedOrigins = rawOrigin
    ? rawOrigin.split(',').map((o) => o.trim().replace(/\/$/, ''))
    : [];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      let isLocalDevelopmentOrigin = false;
      let isAllowedDomain = false;
      try {
        const url = new URL(origin);
        const hostname = url.hostname.toLowerCase();
        const isPrivateIpv4 =
          /^(10|192\.168)\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
          /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);
        isLocalDevelopmentOrigin =
          (url.port === '3000' || !url.port) &&
          (hostname === 'localhost' || hostname === '127.0.0.1' || isPrivateIpv4);
        isAllowedDomain =
          hostname.endsWith('.netlify.app') ||
          hostname === 'netlify.app' ||
          hostname.endsWith('.onrender.com') ||
          hostname.endsWith('.vercel.app');
      } catch {
        isLocalDevelopmentOrigin = false;
      }
      if (
        !rawOrigin ||
        rawOrigin === '*' ||
        allowedOrigins.includes(origin) ||
        isLocalDevelopmentOrigin ||
        isAllowedDomain
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on http://0.0.0.0:${port}`);
}
bootstrap();
