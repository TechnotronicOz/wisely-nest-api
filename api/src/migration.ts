import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import dbConn from './config/db-conn.conf';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...dbConn,
      migrationsTableName: 'schema_migrations',
      migrations: [path.join(__dirname, 'migrations/*.js')],
      cli: {
        migrationsDir: 'migration',
      },
      logging: true,
    }),
  ],
})
export class AppModule {}

async function bootstrap(): Promise<void> {
  return NestFactory.create(AppModule).then((app) => app.close());
}

bootstrap();
