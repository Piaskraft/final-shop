import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { randomBytes, randomUUID as nodeRandomUUID } from 'crypto';

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

  app.enableCors({
    origin: [
      'https://final-shop-1.onrender.com',
      'http://final-shop-1.onrender.com',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3001);
}

void bootstrap();
