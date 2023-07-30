import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production' &&
      process.env.NODE_ENV !== undefined
        ? ['error', 'warn']
        : ['log', 'debug', 'error', 'verbose', 'warn'],
  });
  await app.listen(3000);
}

bootstrap();
