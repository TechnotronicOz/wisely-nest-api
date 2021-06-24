import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isDate } from 'date-fns';

export const iso8601DatePartRegex =
  /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;

@ValidatorConstraint({ async: false })
export class IsCustomDateConstraint implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    return iso8601DatePartRegex.test(date) && isDate(new Date(date));
  }
}

export function IsCustomDate(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: 'time must match the ISO8601 date part standard, yyyy-MM-dd',
      },
      constraints: [],
      validator: IsCustomDateConstraint,
    });
  };
}
