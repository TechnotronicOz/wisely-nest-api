import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local-strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../config/jwt.conf';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OgmaModule } from '@ogma/nestjs-module';
import { Request, Response } from 'express';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    OgmaModule.forFeature(AuthService),
    UsersModule,
    PassportModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {
  static GraphQLModuleContext({ req, res }: { req: Request; res: Response }): {
    req: Request;
    res: Response;
    isGraphql: boolean;
  } {
    return { req, res, isGraphql: true };
  }
}
