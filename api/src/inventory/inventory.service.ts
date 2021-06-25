import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryEntity } from './inventory.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Repository } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { InventoryInputDTO } from './dto/inventory.input.dto';
import {
  newBadRequestException,
  newNotFoundException,
} from '../util/exceptions';
import { dateTimeSorter } from '../util/sorter';

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

  /**
   * Creates multiple inventories
   * @param dtos
   */
  async createMany(dtos: InventoryInputDTO[]): Promise<InventoryEntity[]> {
    // sort by date+time asc
    dtos.sort((a: InventoryInputDTO, b: InventoryInputDTO) =>
      dateTimeSorter(a.date, a.time, b.date, b.time),
    );
    const rets: InventoryEntity[] = [];
    for (let i = 0; i < dtos.length; i++) {
      rets.push(await this.create(dtos[i]));
    }
    return rets;
  }

  /**
   * Creates one inventory
   * @param dto
   */
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
    const e = new InventoryEntity();
    e.restaurantId = dto.restaurantId;
    e.date = dto.date;
    e.time = dto.time;
    e.limit = dto.limit;
    e.created = new Date();
    // typeorm bug https://github.com/typeorm/typeorm/pull/5680
    // sql has: INSERT () VALUES () RETURNING id, created, updated;
    const s = await this.repo.save(e);
    e.id = Number(s.id);
    return e;
  }
}
