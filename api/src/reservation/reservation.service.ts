import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { ReservationEntity } from './reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { newBadRequestException } from '../util/exceptions';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ReservationService extends TypeOrmQueryService<ReservationEntity> {
  private readonly logger: Logger = new Logger(ReservationService.name);

  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepo: Repository<ReservationEntity>,
  ) {
    super(reservationRepo);
  }

  async create(createDto: ReservationInputDTO): Promise<ReservationEntity> {
    // first do we have this inventoryId already in the db?
    const reservationInventory: ReservationEntity[] = await this.query({
      filter: {
        inventory: {
          id: { eq: createDto.inventoryId },
        },
      },
    });

    // if nothing returns, we can't find the inventoryId
    if (!reservationInventory.length) {
      this.logger.error(`inventory not found [id=${createDto.inventoryId}]`);
      throw new NotFoundException(
        new Error(`inventory not found [id=${createDto.inventoryId}]`),
        `inventory not found [id=${createDto.inventoryId}]`,
      );
    }

    // otherwise if the inventory length equals our limit, we can't place
    // the booking
    const totalReservationSize = reservationInventory.reduce(
      (size: 0, reservation: ReservationEntity) => size + reservation.size,
      0,
    );
    const totalInventoryLimit = reservationInventory[0]?.inventory.limit;
    if (totalReservationSize + createDto.size > totalInventoryLimit) {
      this.logger.log(
        'no reservations available for date/time/party size selected',
      );
      throw newBadRequestException(
        'no reservations available for date/time/party size selected',
      );
    }

    this.logger.log(`creating reservation [${JSON.stringify(createDto)}]`);
    // const res = plainToClass(ReservationEntity, {
    //   ...createDto,
    //   created: new Date(),
    // });
    return this.reservationRepo.create({
      ...createDto,
      created: new Date(),
    });
  }
}
