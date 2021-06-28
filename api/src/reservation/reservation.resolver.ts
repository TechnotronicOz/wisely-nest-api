import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReservationDTO } from './dto/reservation.dto';
import { ReservationEntity } from './reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { Logger } from '@nestjs/common';
import { ReservationUpdateDTO } from './dto/reservation.update.dto';

@Resolver(() => ReservationDTO)
export class ReservationResolver {
  private readonly logger: Logger = new Logger(ReservationResolver.name);

  constructor(private readonly reservationService: ReservationService) {}

  @Mutation(() => ReservationDTO)
  async createOneReservation(
    @Args('createInputData') createInputData: ReservationInputDTO,
  ): Promise<ReservationEntity> {
    this.logger.log(
      `creating one reservation [${JSON.stringify(createInputData)}]`,
    );
    return this.reservationService.createOne(createInputData);
  }

  @Mutation(() => ReservationDTO)
  async updateOneReservation(
    @Args('id') id: number,
    @Args('input') input: ReservationUpdateDTO,
  ): Promise<ReservationEntity> {
    this.logger.log(`updating one reservation [${JSON.stringify(input)}]`);
    return this.reservationService.update(id, input);
  }
}
