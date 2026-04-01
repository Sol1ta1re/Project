import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальная валидация (обязательно по ТЗ)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет лишние поля
      forbidNonWhitelisted: true, // ошибка если есть лишние поля
      transform: true, // автоматически преобразует типы (string -> number)
    }),
  );

  // Префикс для всех роутов (необязательно, но удобно)
  // app.setGlobalPrefix('api');

  await app.listen(3000);

  console.log(`🚀 Server running on http://localhost:3000`);
}

bootstrap();