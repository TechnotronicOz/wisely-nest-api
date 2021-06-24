import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryEntity } from './inventory.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
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

  public async create(dto: InventoryInputDTO): Promise<InventoryEntity> {
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

  findByDate(restaurantId: number, date: string): Promise<InventoryEntity[]> {
    return this.query({
      filter: {
        date: { eq: date },
        restaurantId: { eq: restaurantId },
      },
      sorting: [{ field: 'time', direction: SortDirection.ASC }],
    });
  }
}
