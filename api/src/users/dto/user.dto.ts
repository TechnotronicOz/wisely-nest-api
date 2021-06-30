import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FilterableField, IDField } from '@nestjs-query/query-graphql';

@ObjectType('User')
export class UserDTO {
  @IDField(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  password: string;

  @FilterableField()
  created: Date;

  @FilterableField()
  updated?: Date;
}
