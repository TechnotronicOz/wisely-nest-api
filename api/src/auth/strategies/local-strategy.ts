import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../users/user.entity';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @OgmaLogger(LocalStrategy)
    private readonly logger: OgmaService,
    private authService: AuthService,
  ) {
    // super({
    //   passReqToCallback: true,
    // });
    super({
      usernameField: 'email',
    });
  }

  async validate(_: unknown, email: string, password: string): Promise<any> {
    // async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      this.logger.warn(`failed user validation [username=${email}]`);
      throw new UnauthorizedException();
    }

    this.logger.log(`validated user [username=${email}]`);
    return user;
  }
}
