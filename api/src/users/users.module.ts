import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { UserEntity } from './user.entity';
import { UserDTO } from './dto/user.dto';
import { UserInputDTO } from './dto/user.input.dto';
import { OgmaModule } from '@ogma/nestjs-module';
import { UserUpdateDTO } from './dto/user.update.dto';
import { UsersResolver } from './users.resolver';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Module({
  providers: [UsersService, UserEntity, UsersResolver],
  exports: [UsersService],
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity])],
      resolvers: [
        {
          DTOClass: UserDTO,
          EntityClass: UserEntity,
          CreateDTOClass: UserInputDTO,
          UpdateDTOClass: UserUpdateDTO,
          guards: [GqlAuthGuard],
        },
      ],
    }),
    OgmaModule.forFeatures([UsersService, UsersResolver]),
  ],
})
export class UsersModule {}
