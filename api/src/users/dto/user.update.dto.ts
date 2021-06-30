import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType('UserUpdate')
export class UserUpdateDTO {
  @Field()
  @IsNotEmpty()
  password!: string;
}
