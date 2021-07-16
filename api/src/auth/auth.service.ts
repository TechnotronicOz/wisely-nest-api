import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { comparePassToHash } from '../util/passwords';
import { UserEntity } from '../users/user.entity';
import { newNotFoundException } from '../util/exceptions';

@Injectable()
export class AuthService {
  constructor(
    @OgmaLogger(AuthService)
    private readonly logger: OgmaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserEntity> {
    const user = await this.usersService.findByEmail(email);
    const doesMatch = await comparePassToHash(pass, user.password);
    if (!doesMatch) {
      this.logger.log(`password does not match [user=${email}]`);
      return null;
    }
    this.logger.log(`logging in user [username=${email}]`);
    user.password = '';
    return user;
  }

  generateAccessToken(user: UserEntity): LoggedInUserDTO {
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.email,
    });
    this.logger.log(
      `generating access token [user=${user.email}, token=${token}]`,
    );
    return {
      access_token: token,
    };
  }

  /**
   * This runs through local-strategy which calls validateUser
   * and checks the password so when this is called, the user
   * credentials are already authed as valid and we can now
   * generate an access token
   *
   * @param user
   */
  async loginUser(user: UserEntity): Promise<LoggedInUserDTO> {
    if (!user) {
      this.logger.log('cannot login an empty user');
      throw newNotFoundException(`no user provided to login`);
    }

    this.logger.log(`logging in user [user=${user.email}]`);
    return Promise.resolve(this.generateAccessToken(user));
  }
}

export interface UserLoginDTO {
  username: string;
  password: string;
}

export interface LoggedInUserDTO {
  // sub: number;
  // username: string;
  access_token: string;
}
