import { Type } from '../movements/movement.model';

export enum Sort {
  LATEST = '-',
  OLDEST = '+',
}

export interface Filter {
  sort: Sort;
  from: Date | null;
  to: Date | null;
  type: Type | null;
  categories: string[];
}
