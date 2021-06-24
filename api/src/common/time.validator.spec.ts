import { IsCustomTime } from './time.validator';
import { ValidationError, Validator } from 'class-validator';

describe('IsCustomTime Validator', () => {
  const validator: Validator = new Validator();

  it('should be defined', () => {
    expect(IsCustomTime).toBeDefined();
  });

  class MyClass {
    @IsCustomTime()
    myTime: string;
  }

  it('should validate ISO8601 date part', async () => {
    const m = new MyClass();
    m.myTime = '16:00';
    const res: ValidationError[] = await validator.validate(m);
    expect(res.length).toEqual(0);
  });

  it('should validate that our time interval falls on the 15th minute', async () => {
    const expectedErr = {
      IsCustomTimeConstraint: 'time must be on a 15 min interval',
    };
    const m = new MyClass();
    m.myTime = '16:00';
    const res: ValidationError[] = await validator.validate(m);
    expect(res.length).toEqual(0);

    m.myTime = '16:15';
    const res2: ValidationError[] = await validator.validate(m);
    expect(res2.length).toEqual(0);

    m.myTime = '16:30';
    const res3: ValidationError[] = await validator.validate(m);
    expect(res3.length).toEqual(0);

    m.myTime = '16:45';
    const res4: ValidationError[] = await validator.validate(m);
    expect(res4.length).toEqual(0);

    m.myTime = '15:02';
    const res5: ValidationError[] = await validator.validate(m);
    expect(res5.length).toEqual(1);
    expect(res5[0].constraints).toEqual(expectedErr);

    m.myTime = '15:17';
    const res6: ValidationError[] = await validator.validate(m);
    expect(res6.length).toEqual(1);
    expect(res6[0].constraints).toEqual(expectedErr);
  });

  it('should fail to validate on malformed time', async () => {
    const expectedErr = {
      IsCustomTimeConstraint:
        'time must match the ISO8601 date part standard, yyyy-MM-dd',
    };

    const m = new MyClass();
    m.myTime = '3:00pm';
    const res: ValidationError[] = await validator.validate(m);
    expect(res.length).toEqual(1);
    expect(res[0].constraints).toEqual(expectedErr);

    m.myTime = '14:23:05';
    const res2: ValidationError[] = await validator.validate(m);
    expect(res2.length).toEqual(1);
    expect(res2[0].constraints).toEqual(expectedErr);

    m.myTime = '18:22:05.001';
    const res3: ValidationError[] = await validator.validate(m);
    expect(res3.length).toEqual(1);
    expect(res3[0].constraints).toEqual(expectedErr);

    m.myTime = 'random string';
    const res4: ValidationError[] = await validator.validate(m);
    expect(res4.length).toEqual(1);
    expect(res4[0].constraints).toEqual(expectedErr);
  });
});
