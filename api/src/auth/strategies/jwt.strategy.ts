import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../../config/jwt.conf';
import { UsersService } from '../../users/users.service';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @OgmaLogger(JwtStrategy)
    private readonly logger: OgmaService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any, ...args) {
    this.logger.log('JwtStrategy.validate', JSON.stringify(payload));
    this.logger.log(JSON.stringify(args));
    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
