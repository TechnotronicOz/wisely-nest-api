import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.WISE_API_PORT || 3000;
  logger.log(`starting up on ${port}...`);
  await app.listen(process.env.WISE_API_PORT || 3000);
}
bootstrap();
