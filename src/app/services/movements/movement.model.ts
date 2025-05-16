export enum Type {
    EXPENSE = 'EXPENSE',
    INCOME = 'INCOME',
}
  
export interface Movement {
  id: number;
  date: Date;
  type: Type;
  value: number;
  total: number;
  category: string;
  description: string
}