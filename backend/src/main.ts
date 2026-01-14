import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DEV: pozwól na front lokalny (CRA zwykle 3000, ale u Ciebie może być 3001)
  // PROD: jeśli backend serwuje front (ServeStatic), CORS i tak nie jest potrzebny,
  // ale zostawiamy bezpiecznie.
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  });

 const port = process.env.PORT || 3000;
await app.listen(port);

}
bootstrap();
