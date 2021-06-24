import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

export const timeRegex = /^(2[0-3]|[01][0-9]):?([0-5][0-9])$/;

@ValidatorConstraint({ async: true })
export class IsCustomTimeConstraint implements ValidatorConstraintInterface {
  fifteenInterval(ts: string): boolean {
    return Number(ts.split(':')[1]) % 15 === 0;
  }

  validate(ts: string, args: ValidationArguments) {
    return timeRegex.test(ts) && this.fifteenInterval(ts);
  }
}

export function IsCustomTime(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: 'time must be on a 15 min interval',
      },
      constraints: [],
      validator: IsCustomTimeConstraint,
    });
  };
}
