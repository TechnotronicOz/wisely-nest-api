import { IsCustomDate } from './date.validator';
import { ValidationError, Validator } from 'class-validator';

describe('IsCustomDate Validator', () => {
  const validator: Validator = new Validator();

  it('should be defined', () => {
    expect(IsCustomDate).toBeDefined();
  });

  class MyClass {
    @IsCustomDate()
    myDate: string;
  }

  it('should validate ISO8601 date part', async () => {
    const m = new MyClass();
    m.myDate = '2021-06-22';
    const res: ValidationError[] = await validator.validate(m);
    expect(res.length).toEqual(0);
  });

  it('should fail to validate on malformed date', async () => {
    const expectedErr = {
      IsCustomDateConstraint:
        'time must match the ISO8601 date part standard, yyyy-MM-dd',
    };

    const m = new MyClass();
    m.myDate = '06-22-2021';
    const res: ValidationError[] = await validator.validate(m);
    expect(res.length).toEqual(1);
    expect(res[0].constraints).toEqual(expectedErr);

    m.myDate = '06-2021';
    const res2: ValidationError[] = await validator.validate(m);
    expect(res2.length).toEqual(1);
    expect(res2[0].constraints).toEqual(expectedErr);

    m.myDate = '06-22-21';
    const res3: ValidationError[] = await validator.validate(m);
    expect(res3.length).toEqual(1);
    expect(res3[0].constraints).toEqual(expectedErr);

    // has to be real date
    m.myDate = '2222-55-66';
    const res4: ValidationError[] = await validator.validate(m);
    expect(res4.length).toEqual(1);
    expect(res4[0].constraints).toEqual(expectedErr);

    // can't be a random string that won't translate into a Date
    m.myDate = 'random string';
    const res5: ValidationError[] = await validator.validate(m);
    expect(res5.length).toEqual(1);
    expect(res5[0].constraints).toEqual(expectedErr);
  });
});
