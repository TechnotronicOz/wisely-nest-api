import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryEntity } from './inventory.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { isBefore, isAfter } from 'date-fns';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Repository } from 'typeorm';
import { QueryService, SortDirection } from '@nestjs-query/core';
import { InventoryInputDTO } from './dto/inventory.input.dto';
import {
  newBadRequestException,
  newNotFoundException,
} from '../util/exceptions';
import { plainToClass } from 'class-transformer';

@Injectable()
@QueryService(InventoryEntity)
export class InventoryService extends TypeOrmQueryService<InventoryEntity> {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(InventoryEntity)
    readonly repo: Repository<InventoryEntity>,
    private readonly restaurantService: RestaurantService,
  ) {
    super(repo);
  }

  async createMany(dtos: InventoryInputDTO[]): Promise<InventoryEntity[]> {
    // sort by time
    dtos.sort((a, b) => {
      const ad = new Date(`${a.date}T${a.time}`);
      const bd = new Date(`${b.date}T${b.time}`);
      if (isAfter(ad, bd)) {
        return 1;
      }
      if (isBefore(ad, bd)) {
        return -1;
      }
      return 0;
    });
    const rets: InventoryEntity[] = [];
    for (let i = 0; i < dtos.length; i++) {
      rets.push(await this.create(dtos[i]));
    }
    return rets;
  }

  async create(dto: InventoryInputDTO): Promise<InventoryEntity> {
    const restaurantId = dto.restaurantId;
    const restaurant = await this.restaurantService.getById(restaurantId);
    if (!restaurant || !restaurant.id) {
      const e = newNotFoundException(
        `unable to find restaurant [id=${restaurantId}]`,
      );
      this.logger.error(e);
      throw e;
    }

    const exists = await this.repo.count({
      where: {
        restaurantId,
        date: dto.date,
        time: dto.time,
      },
    });

    if (exists) {
      return Promise.reject(
        newBadRequestException(
          'cannot create inventory, conflicts with existing records',
        ),
      );
    }

    this.logger.log(`creating new inventory record [${JSON.stringify(dto)}]`);
    const inventory = plainToClass(InventoryEntity, {
      ...dto,
      created: new Date(),
    });
    return this.repo.create(inventory);
  }
}
