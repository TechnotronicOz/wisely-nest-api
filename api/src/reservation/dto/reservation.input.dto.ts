import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType('ReservationInput')
export class ReservationInputDTO {
  @Field()
  @IsEmail()
  user!: string;

  @Field()
  @IsString()
  name?: string;

  @Field()
  @IsNumber()
  @Min(1)
  size!: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  inventoryId!: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  restaurantId!: number;
}
