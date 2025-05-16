export enum Currency {
  ARS = 'ARS',
  USD = 'USD',
}

export interface Budget {
  name: string;
  currency: Currency;
  balance: number;
  income: number;
  expenses: number;
  categories: string[];
}