import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { ReservationEntity } from './reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { newBadRequestException } from '../util/exceptions';
import { InventoryEntity } from '../inventory/inventory.entity';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class ReservationService extends TypeOrmQueryService<ReservationEntity> {
  private readonly logger: Logger = new Logger(ReservationService.name);

  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepo: Repository<ReservationEntity>,
    private readonly inventoryService: InventoryService,
  ) {
    super(reservationRepo);
  }

  /**
   * Creates one reservation
   * @param createDto
   */
  async createOne(createDto: ReservationInputDTO): Promise<ReservationEntity> {
    // first do we have this inventoryId already in the db?
    const inventory: InventoryEntity = await this.inventoryService.findById(
      createDto.inventoryId,
    );

    // if nothing returns, we can't find the inventoryId
    if (!inventory) {
      this.logger.error(`inventory not found [id=${createDto.inventoryId}]`);
      throw new NotFoundException(
        new Error(`inventory not found [id=${createDto.inventoryId}]`),
        `inventory not found [id=${createDto.inventoryId}]`,
      );
    }

    const reservationInventory: ReservationEntity[] =
      await this.reservationRepo.find({
        where: {
          inventoryId: { eq: createDto.inventoryId },
        },
      });

    // otherwise if the inventory length equals our limit, we can't place
    // the booking
    const totalReservationSize = reservationInventory.reduce(
      (size: 0, reservation: ReservationEntity) => size + reservation.size,
      0,
    );
    const totalInventoryLimit = inventory.limit;
    if (totalReservationSize + createDto.size > totalInventoryLimit) {
      this.logger.log(
        'no reservations available for date/time/party size selected',
      );
      throw newBadRequestException(
        'no reservations available for date/time/party size selected',
      );
    }

    this.logger.log(`creating reservation [${JSON.stringify(createDto)}]`);
    const e = new ReservationEntity();
    e.restaurantId = createDto.restaurantId;
    e.inventoryId = createDto.inventoryId;
    e.user = createDto.user;
    e.size = createDto.size;
    e.created = new Date();
    const s = await this.reservationRepo.save(e);
    e.id = Number(s.id);
    return e;
  }
}
