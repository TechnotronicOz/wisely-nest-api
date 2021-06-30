import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

  async findOne(username: string): Promise<UserEntity | undefined> {
    return await this.repo.findOneOrFail({
      where: {
        email: username,
      },
    });
  }
}
