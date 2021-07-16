import { Field } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthLoginInputDTO {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsAlphanumeric()
  password!: string;
}
