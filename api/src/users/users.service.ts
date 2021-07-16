import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @OgmaLogger(UsersService)
    private readonly logger: OgmaService,
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    this.logger.log(`looking up user [email=${email}]`);
    const user = await this.repo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      this.logger.error(`no user found [email=${email}]`);
      throw new Error('no user found!');
    }

    this.logger.log(`found user [email=${email}, id=${user.id}]`);
    return user;
  }
}
