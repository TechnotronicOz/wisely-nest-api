import { mapAttach, Mapper } from './domain-mapper';

class TestEntity {
  id: number;
  name: string;
}

class TestInputDTO {
  id: number;
  name: string;
}

class TestUpdateDTO {
  name: string;
}

export class TestMapper extends Mapper<
  TestEntity,
  TestInputDTO,
  TestUpdateDTO
> {
  toDomain(raw: TestInputDTO): TestEntity {
    const e = new TestEntity();
    e.name = raw.name;
    return e;
  }

  toDTO(t): TestInputDTO {
    return {
      id: t.id,
      name: t.name,
    };
  }

  attachId(id: string | number, e: TestEntity): void {
    e.id = +id;
  }
}

describe('util/domain-mapper', () => {
  it('should do generic translation for DTO to Entity mapping', () => {
    const m = new TestMapper();
    const dto = new TestInputDTO();
    dto.name = 'Matt';
    const e = m.toDomain(dto);
    m.attachId(1, e);
    expect(e.id).toEqual(1);
    expect(e.name).toEqual('Matt');
  });

  it('should do generic translation for Entity to DTO mapping', () => {
    const m = new TestMapper();
    const dto = new TestInputDTO();
    dto.name = 'Matt2';
    const e = new TestEntity();
    e.name = 'Matt2';
    const transformedDto = m.toDTO(e);
    expect(transformedDto).toEqual(dto);
  });

  it('should mapAttach all keys from a dto object to an entity object', () => {
    const entity = new TestEntity();
    entity.id = 1;
    entity.name = 'Matt';
    const dto = new TestInputDTO();
    dto.name = 'Matthew';
    mapAttach<TestEntity, TestInputDTO>(entity, dto);
    expect(entity.name).toEqual('Matthew');
  });
});
