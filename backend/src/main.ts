import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:3001',
        'https://*.railway.app'
      ],
      credentials: true,
    });
  // Habilitar validación global con transformación para que los DTOs
  // conviertan y validen tipos (por ejemplo latitud/longitud strings -> number)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

