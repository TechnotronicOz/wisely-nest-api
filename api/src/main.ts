import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { OgmaService } from '@ogma/nestjs-module';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { apiPort } from './config/api-endpoint.conf';
import env from './config/env.conf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // allows us to see Nest module lifecycle events and find issues
    logger: env.isDevelopment ? new OgmaService() : false,
  });
  const logger = app.get<OgmaService>(OgmaService);
  app.useGlobalPipes(new ValidationPipe());
  if (!env.isDevelopment) {
    app.use(helmet()); // helmet blocks the playground, amongst other things
  }
  app.useLogger(logger);
  app.enableCors();

  logger.log(`starting up on ${apiPort}...`);
  await app.listen(apiPort);
}
bootstrap();
