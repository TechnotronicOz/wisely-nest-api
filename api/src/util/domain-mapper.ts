export interface IMapper<EntityClass, DTOClass> {
  toDomain(raw: DTOClass): EntityClass;
  toDTO(t: any): DTOClass;
  attachId(id: string | number, t: EntityClass): void;
}

export abstract class Mapper<EntityClass, DTOClass>
  implements IMapper<EntityClass, DTOClass>
{
  abstract toDTO(t: any): DTOClass;

  abstract toDomain(raw: DTOClass): EntityClass;

  abstract attachId(id: string | number, t: EntityClass): void;
}
