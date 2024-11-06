export interface Property {
  id: number;
  address: string;
  price: number;
  returnOnInvestment: number;
  cashflow: number;
  imageUrl: string | null;
}

export interface Income {
  id: number;
  amount: number;
  type: 'monthly' | 'yearly';
}

export enum ExpenseType {
  Monthly = 'monthly',
  Yearly = 'yearly'
}

export interface Expense {
  id: number;
  amount: number;
  type: ExpenseType;
  name: string;
}

export interface NormalizedIncome {
  id: number;
  amount: number;
  type: 'monthly' | 'yearly' | string;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NormalizedExpense {
  id: number;
  amount: number;
  type: 'monthly' | 'yearly' | string;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}
