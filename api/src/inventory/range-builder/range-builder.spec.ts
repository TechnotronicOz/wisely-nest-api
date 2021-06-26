import { RangeBuilder } from './range-builder';

describe('RangeBuilder', () => {
  it('should be defined', () => {
    expect(
      new RangeBuilder(
        new Date('2021-06-22T15:00'),
        new Date('2021-06-22T15:30'),
      ),
    ).toBeDefined();
  });

  it('should throw error if start or end are not on 15 min intervals', () => {
    try {
      new RangeBuilder(new Date('2021-06-22T14:22'), new Date()).build();
    } catch (e) {
      expect(e.message).toEqual(
        'start must be on 15 min interval (00, 15, 30, 45)',
      );
    }

    try {
      new RangeBuilder(
        new Date('2021-06-22T15:00'),
        new Date('2021-06-22T16:58'),
      ).build();
    } catch (e) {
      expect(e.message).toEqual(
        'end must be on 15 min interval (00, 15, 30, 45)',
      );
    }
  });

  it('should count 15 minute intervals', () => {
    const start = new Date('2021-06-22T15:00');
    const end = new Date('2021-06-22T16:30');
    const tuples = new RangeBuilder(start, end).build();
    expect(tuples.length).toEqual(7);

    const t1 = tuples[0];
    expect(t1[0]).toEqual('2021-06-22');
    expect(t1[1]).toEqual('15:00');

    const t2 = tuples[1];
    expect(t2[0]).toEqual('2021-06-22');
    expect(t2[1]).toEqual('15:15');

    const t3 = tuples[2];
    expect(t3[0]).toEqual('2021-06-22');
    expect(t3[1]).toEqual('15:30');

    const t4 = tuples[3];
    expect(t4[0]).toEqual('2021-06-22');
    expect(t4[1]).toEqual('15:45');

    const t5 = tuples[4];
    expect(t5[0]).toEqual('2021-06-22');
    expect(t5[1]).toEqual('16:00');

    const t6 = tuples[5];
    expect(t6[0]).toEqual('2021-06-22');
    expect(t6[1]).toEqual('16:15');

    const t7 = tuples[6];
    expect(t7[0]).toEqual('2021-06-22');
    expect(t7[1]).toEqual('16:30');
  });

  it('should cap built tuples at 200', () => {
    const start = new Date('2021-06-22T15:00');
    const end = new Date('2022-07-22T16:30');
    const tuples = new RangeBuilder(start, end).build();
    expect(tuples.length).toEqual(200);
  });
});
