import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserDTO } from './dto/user.dto';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { UserInputDTO } from './dto/user.input.dto';
import { AuthService } from '../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => UserDTO)
export class UsersResolver {
  constructor(
    @OgmaLogger(UsersResolver)
    private readonly logger: OgmaService,
    private readonly userService: UsersService,
  ) {}

  // @Mutation(() => UserDTO)
  // async login(@Args('user') user: UserInputDTO): Promise<UserEntity> {
  // const isValidated = await this.authService.validateUser(
  //   user.email,
  //   user.password,
  // );
  // if (!isValidated) {
  //   throw new UnauthorizedException();
  // }
  // return await this.authService.login(user);
  // return new UserEntity();
  // return null;
  // }
}
