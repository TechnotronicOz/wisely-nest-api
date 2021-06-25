import { dateTimeSorter } from './sorter';

describe('util/sorter', () => {
  it('sort an array of string date, string time', () => {
    const dto1 = { date: '2021-06-22', time: '15:00' };
    const dto2 = { date: '2021-06-22', time: '15:15' };
    const dto3 = { date: '2021-06-22', time: '17:00' };
    const dto4 = { date: '2021-06-22', time: '19:00' };
    const dto5 = { date: '2021-06-23', time: '12:00' };
    const dto6 = { date: '2021-06-25', time: '19:00' };
    const datesToSort = [dto3, dto6, dto4, dto1, dto2, dto5];
    datesToSort.sort((a, b) => dateTimeSorter(a.date, a.time, b.date, b.time));
    expect(datesToSort[0]).toEqual(dto1);
    expect(datesToSort[1]).toEqual(dto2);
    expect(datesToSort[2]).toEqual(dto3);
    expect(datesToSort[3]).toEqual(dto4);
    expect(datesToSort[4]).toEqual(dto5);
    expect(datesToSort[5]).toEqual(dto6);
  });
});
