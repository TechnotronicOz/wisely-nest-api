import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { ReservationEntity } from './reservation.entity';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reservation')
export class ReservationController {
  constructor(
    @OgmaLogger(ReservationController)
    private readonly logger: OgmaService,
    private readonly service: ReservationService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createReservationDto: ReservationInputDTO) {
    this.logger.log(
      `create reservation [${JSON.stringify(createReservationDto)}]`,
    );
    return this.service.createOne(createReservationDto);
  }

  @Get('/test')
  @UseGuards(JwtAuthGuard)
  async testing() {
    this.logger.log('testing!');
    return 'ok!';
  }
}
