import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  private readonly logger: Logger = new Logger(ReservationController.name);

  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() createReservationDto: ReservationInputDTO) {
    this.logger.log(
      `creating reservation [${JSON.stringify(createReservationDto)}]`,
    );
    return this.reservationService.create(createReservationDto);
  }
}
