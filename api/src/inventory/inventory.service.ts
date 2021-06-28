import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryEntity } from './inventory.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Repository, In } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { InventoryInputDTO } from './dto/inventory.input.dto';
import {
  newBadRequestException,
  newNotFoundException,
} from '../util/exceptions';
import { dateTimeSorter } from '../util/sorter';
import { RangeBuilder } from './range-builder/range-builder';
import { InventoryRangeInputDTO } from './dto/inventory-range.input.dto';
import { InventoryMapper } from './inventory.mapper';
import { Mapper } from '../util/domain-mapper';

@Injectable()
@QueryService(InventoryEntity)
export class InventoryService extends TypeOrmQueryService<InventoryEntity> {
  private readonly logger = new Logger(InventoryService.name);

  private readonly mapper: Mapper<
    InventoryEntity,
    InventoryInputDTO,
    InventoryInputDTO
  >;

  constructor(
    @InjectRepository(InventoryEntity)
    readonly repo: Repository<InventoryEntity>,
    private readonly restaurantService: RestaurantService,
  ) {
    super(repo);
    this.mapper = new InventoryMapper();
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
   * Creates many inventory for a date range
   * @param rangeDto
   */
  async createForRange(
    rangeDto: InventoryRangeInputDTO,
  ): Promise<InventoryEntity[]> {
    const { startDate, startTime, endDate, endTime } = rangeDto;
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const dtTuples = new RangeBuilder(start, end).build();
    const inputs: InventoryInputDTO[] = dtTuples.map(
      ([date, time]): InventoryInputDTO => {
        return {
          restaurantId: rangeDto.restaurantId,
          limit: rangeDto.limit,
          date,
          time,
        };
      },
    );

    await this.checkForDuplicatesInRange(rangeDto.restaurantId, inputs);

    this.logger.log(
      `creating range for ${inputs.length} inventories [restaurantId=${rangeDto.restaurantId}, limit=${rangeDto.limit}]`,
    );

    return this.createMany(inputs);
  }

  /**
   * Given a range we generated, find duplicate records in the db
   * @param restaurantId
   * @param inputDtos
   * @private
   */
  private async checkForDuplicatesInRange(
    restaurantId: number,
    inputDtos: InventoryInputDTO[],
  ): Promise<void> {
    const dupes: InventoryEntity[] = await this.repo.find({
      where: {
        restaurantId,
        date: In(inputDtos.map((i) => i.date)),
        time: In(inputDtos.map((i) => i.time)),
      },
    });

    if (dupes.length) {
      const dupeIds = dupes.map((d) => +d.id);
      this.logger.error(
        `inventory range produce duplicates [restaurantId=${restaurantId}, ids=${JSON.stringify(
          dupeIds,
        )}]`,
      );
      throw newBadRequestException(
        `inventory range has produced duplicates of existing records [ids=${JSON.stringify(
          dupeIds,
        )}]`,
      );
    }

    return Promise.resolve();
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
    const e = this.mapper.toDomain(dto);
    // typeorm bug https://github.com/typeorm/typeorm/pull/5680
    // sql has: INSERT () VALUES () RETURNING id, created, updated;
    const s = await this.repo.save(e);
    this.mapper.attachId(s.id, e);
    return e;
  }
}
