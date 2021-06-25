import { isAfter, isBefore } from 'date-fns';

export function dateTimeSorter(
  d1: string,
  t1: string,
  d2: string,
  t2: string,
): number {
  const splitDateToDate = (d: string, t: string) => new Date(`${d}T${t}`);
  const aDate = splitDateToDate(d1, t1);
  const bDate = splitDateToDate(d2, t2);
  if (isAfter(aDate, bDate)) {
    return 1;
  }
  if (isBefore(aDate, bDate)) {
    return -1;
  }
  return 0;
}
