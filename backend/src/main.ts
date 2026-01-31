import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { randomBytes, randomUUID as nodeRandomUUID } from 'crypto';
import { existsSync } from 'fs';
import { join } from 'path';
import type { Request, Response, NextFunction } from 'express';

type CryptoLike = { randomUUID: () => string };

// ważne: cast przez unknown, żeby TS nie widział readonly/DOM Crypto
const g = globalThis as unknown as { crypto?: CryptoLike };

const generateUUID: () => string =
  typeof nodeRandomUUID === 'function'
    ? () => nodeRandomUUID()
    : () => {
        const bytes = randomBytes(16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
        const hex = bytes.toString('hex');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      };

if (!g.crypto?.randomUUID) {
  g.crypto = { randomUUID: generateUUID };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS: potrzebne tylko gdy front i backend są na różnych domenach (np. osobny frontend na Render).
  // Przy ServeStatic (jeden serwer) requesty są same-origin i CORS nie przeszkadza.
  app.enableCors({
    origin: [
      'https://final-shop-1.onrender.com',
      'http://final-shop-1.onrender.com',
      'https://final-shop-qoz3.onrender.com',
      'http://final-shop-qoz3.onrender.com',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.enableShutdownHooks();

  // SPA fallback: React Router refresh fix (/cart, /checkout, itp.)
  // Działa tylko jeśli istnieje backend/public/index.html (czyli po build+copy Reacta).
 const publicDir = join(__dirname, '..', 'public');

  const hasIndex = existsSync(join(publicDir, 'index.html'));

  if (hasIndex) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET') return next();
      if (req.path.startsWith('/api')) return next();
      if (req.path.includes('.')) return next(); // assets: .js .css .png itp.

      return res.sendFile('index.html', { root: publicDir });
    });
  }

  await app.listen(process.env.PORT || 3001);
}

void bootstrap();
