interface IMapper<EntityClass, DTOInsertClass, DTOUpdateClass> {
  toDomain(raw: DTOInsertClass | DTOUpdateClass): EntityClass;
  toDTO(t: any): DTOInsertClass | DTOUpdateClass;
  attachId(id: string | number, t: EntityClass): void;
}

export abstract class Mapper<EntityClass, DTOInsertClass, DTOUpdateClass>
  implements IMapper<EntityClass, DTOInsertClass, DTOUpdateClass>
{
  abstract toDTO(t: any): DTOInsertClass | DTOUpdateClass;

  abstract toDomain(raw: DTOInsertClass | DTOUpdateClass): EntityClass;

  abstract attachId(id: string | number, t: EntityClass): void;
}

export function mapAttach<EntityClass, DTOClass>(
  e: EntityClass,
  d: DTOClass,
): void {
  Object.keys(d).forEach((k) => {
    e[k] = d[k];
  });
}
