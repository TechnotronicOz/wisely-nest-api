import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { InventoryModule } from './inventory/inventory.module';
import { Module } from '@nestjs/common';
import { ReservationModule } from './reservation/reservation.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import env from './config/env.conf';
import dbConf from './config/db-conn.conf';
import loggingConf from './config/logging.conf';
import { OgmaInterceptor, OgmaModule, OgmaService } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';
import { GraphQLParser } from '@ogma/platform-graphql';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      ...dbConf,
    }),
    GraphQLModule.forRoot({
      debug: env.isDevelopment,
      autoSchemaFile: 'schema.gql',
      cors: true,
      context: AuthModule.GraphQLModuleContext,
      playground: env.isDevelopment,
      logger: new OgmaService(),
    }),
    OgmaModule.forRoot({
      service: {
        color: env.isDevelopment,
        json: env.isProduction,
        application: loggingConf.apiName,
      },
      interceptor: {
        http: ExpressParser,
        gql: GraphQLParser,
        ws: false,
        rpc: false,
      },
    }),
    InventoryModule,
    ReservationModule,
    RestaurantModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: OgmaInterceptor }],
})
export class AppModule {}
