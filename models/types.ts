import { Frequency } from '@prisma/client';
import { FinancingOption } from './financing/types';

export interface Property {
  id: number;
  address: string;
  price: number;
  returnOnInvestment: number;
  cashflow: number;
  imageUrl: string | null;
  financing?: FinancingOption;
}

export interface Income {
  id: number;
  amount: number;
  frequency: Frequency;
}

export enum ExpenseType {
  Monthly = 'monthly',
  Yearly = 'yearly'
}

export interface Expense {
  id: number;
  amount: number;
  frequency: Frequency;
  name: string;
}

export interface NormalizedIncome {
  id: number;
  amount: number;
  frequency: Frequency;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NormalizedExpense {
  id: number;
  name: string;
  amount: number;
  frequency: Frequency;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}
