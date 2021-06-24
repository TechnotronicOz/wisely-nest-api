import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReservationDTO } from './dto/reservation.dto';
import { ReservationEntity } from './reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { Logger } from '@nestjs/common';

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
    return this.reservationService.create(createInputData);
  }
}
