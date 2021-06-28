import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { ReservationEntity } from './reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import {
  newBadRequestException,
  newNotFoundException,
} from '../util/exceptions';
import { InventoryEntity } from '../inventory/inventory.entity';
import { InventoryService } from '../inventory/inventory.service';
import { Mapper } from '../util/domain-mapper';
import { ReservationMapper } from './reservation.mapper';
import { ReservationUpdateDTO } from './dto/reservation.update.dto';

@Injectable()
export class ReservationService extends TypeOrmQueryService<ReservationEntity> {
  private readonly logger: Logger = new Logger(ReservationService.name);

  private readonly mapper: Mapper<
    ReservationEntity,
    ReservationInputDTO,
    ReservationUpdateDTO
  >;

  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepo: Repository<ReservationEntity>,
    private readonly inventoryService: InventoryService,
  ) {
    super(reservationRepo);
    this.mapper = new ReservationMapper();
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
      throw newNotFoundException(
        `inventory not found [id=${createDto.inventoryId}]`,
      );
    }

    const canFit = await this.canInventoryHoldReservation(
      inventory,
      createDto.size,
    );
    if (!canFit) {
      this.logger.log(
        'no reservations available for date/time/party size selected',
      );
      throw newBadRequestException(
        'no reservations available for date/time/party size selected',
      );
    }

    this.logger.log(`creating reservation [${JSON.stringify(createDto)}]`);
    const e = this.mapper.toDomain(createDto);
    // typeorm bug https://github.com/typeorm/typeorm/pull/5680
    // sql has: INSERT () VALUES () RETURNING id, created, updated;
    const s = await this.reservationRepo.save(e);
    this.mapper.attachId(s.id, e);
    return e;
  }

  /**
   * Updates a reservation
   * @param id
   * @param update
   */
  async update(
    id: number,
    update: ReservationUpdateDTO,
  ): Promise<ReservationEntity> {
    const reservation = await this.reservationRepo.findOneOrFail(id);

    if (reservation.size === update.size) {
      // no need to update the reservation if there is no diff
      return Promise.resolve(reservation);
    }

    const inventory: InventoryEntity = await this.inventoryService.findById(
      reservation.inventoryId,
    );

    if (!inventory) {
      this.logger.error(`inventory not found [id=${reservation.inventoryId}]`);
      throw newNotFoundException(
        `inventory not found [id=${reservation.inventoryId}]`,
      );
    }

    // can we fit the updated reservation with our other reservations?
    const canFit = await this.canInventoryHoldReservation(
      inventory,
      update.size - reservation.size, // include the existing reservation in the db
    );
    if (!canFit) {
      throw newBadRequestException(
        'no reservations available for date/time/party size selected, unable to update',
      );
    }

    this.logger.log(`updating reservation [id=${id}, newSize=${update.size}]`);
    await this.reservationRepo.update(id, { size: update.size });
    reservation.size = update.size;
    return reservation;
  }

  /**
   * Given an inventory, return the sum of reserved seats
   * @param restaurantId
   * @param inventoryId
   * @private
   */
  private async getExitingReservationsSizeSum(
    restaurantId: number,
    inventoryId: number,
  ): Promise<number> {
    const reservationInventory: ReservationEntity[] =
      await this.reservationRepo.find({
        where: { restaurantId, inventoryId },
      });

    return Promise.resolve(
      reservationInventory.reduce(
        (size: 0, reservation: ReservationEntity) => size + reservation.size,
        0,
      ),
    );
  }

  /**
   * Given an InventoryEntity and a reservation size, the
   * reservation accommodate it?
   *
   * @param {InventoryEntity} inventory
   * @param reservationSize
   * @private
   */
  private async canInventoryHoldReservation(
    inventory: InventoryEntity,
    reservationSize: number,
  ): Promise<boolean> {
    const totalReservationSize = await this.getExitingReservationsSizeSum(
      inventory.restaurantId,
      inventory?.id,
    );

    const totalInventoryLimit = inventory.limit;
    if (totalReservationSize + reservationSize > totalInventoryLimit) {
      this.logger.log(
        'no reservations available for date/time/party size selected',
      );
      return Promise.resolve(false);
    }

    // we can fit it!
    return Promise.resolve(true);
  }
}
