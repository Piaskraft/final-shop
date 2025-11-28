import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // !!! DODAJ TO:
  app.enableCors({
    origin: 'http://localhost:3001', // Twój frontend
  });

  await app.listen(3000);
}
bootstrap();
