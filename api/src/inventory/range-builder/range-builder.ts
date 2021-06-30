import { add, format } from 'date-fns';
import { fifteenInterval } from '../../validators/time.validator';
import { Logger } from '@nestjs/common';

const MAX_COMPLEXITY = 200; // hard limit of 200 record per request
const DEFAULT_INTERVAL = 15; // minutes

export class RangeBuilder {
  private readonly d1: Date;
  private readonly d2: Date;
  private readonly dtTuples = [];
  private readonly logger: Logger = new Logger(RangeBuilder.name);

  constructor(d1: Date, d2: Date) {
    this.d1 = d1;
    this.d2 = d2;

    const df = (d) => format(d, 'HH:mm');
    if (!fifteenInterval(df(d1))) {
      throw new Error('start must be on 15 min interval (00, 15, 30, 45)');
    }
    if (!fifteenInterval(df(d2))) {
      throw new Error('end must be on 15 min interval (00, 15, 30, 45)');
    }
  }

  build(): string[] {
    let dateIncrementer = this.d1;
    let complexityCounter = 0;

    while (dateIncrementer <= this.d2) {
      if (complexityCounter >= MAX_COMPLEXITY) {
        this.logger.warn(
          `at max complexity, stopping generation [d1=${this.d1}, id2=${this.d2}]`,
        );
        break;
      }
      complexityCounter++;
      this.dtTuples.push([
        format(dateIncrementer, 'yyyy-MM-dd'),
        format(dateIncrementer, 'HH:mm'),
      ]);
      dateIncrementer = add(dateIncrementer, {
        minutes: DEFAULT_INTERVAL,
      });
    }

    return this.dtTuples;
  }
}
