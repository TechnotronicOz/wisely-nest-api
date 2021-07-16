import { Field, InputType } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

@InputType('UserUpdate')
export class UserUpdateDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsAlphanumeric()
  password!: string;
}
