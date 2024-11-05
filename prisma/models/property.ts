import { Expense, Income } from '@prisma/client';

export interface SimplifiedIncome {
  id: number;
  amount: number;
  type: 'monthly' | 'yearly' | string;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimplifiedExpense {
  id: number;
  amount: number;
  type: 'monthly' | 'yearly' | string;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Property {
  id: number;
  address: string;
  price: number;
  imageUrl: string | null;
  incomes: SimplifiedIncome[] = [];
  expenses: SimplifiedExpense[] = [];

  constructor(
    id: number,
    address: string,
    price: number,
    imageUrl: string | null,
    incomes: SimplifiedIncome[] = [],
    expenses: SimplifiedExpense[] = []
  ) {
    this.id = id;
    this.address = address;
    this.price = price;
    this.imageUrl = imageUrl;
    this.incomes = incomes;
    this.expenses = expenses;
  }

  get imageUrlFromAddress(): string {
    return (
      '/' +
      this.address
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') +
      '.jpg'
    );
  }

  get returnOnInvestment(): number {
    return this.calculateROI();
  }

  get cashflow(): number {
    return this.calculateCashFlow();
  }

  calculateMonthlyIncome(): number {
    return this.incomes.reduce((total, income) => {
      return (
        total +
        (income.type === 'yearly'
          ? Number(income.amount) / 12
          : Number(income.amount))
      );
    }, 0);
  }

  calculateMonthlyExpenses(): number {
    return this.expenses.reduce((total, expense) => {
      const amount = Number(expense.amount);
      return total + (expense.type === 'yearly' ? amount / 12 : amount);
    }, 0);
  }

  calculateCashFlow(): number {
    return this.calculateMonthlyIncome() - this.calculateMonthlyExpenses();
  }

  calculateROI(): number {
    const annualCashFlow = this.calculateCashFlow() * 12;
    return (annualCashFlow / this.price) * 100;
  }

  toObject() {
    return {
      id: this.id,
      address: this.address,
      price: this.price,
      returnOnInvestment: this.returnOnInvestment,
      cashflow: this.cashflow,
      imageUrl: this.imageUrl || this.imageUrlFromAddress,
      incomes: this.incomes,
      expenses: this.expenses
    };
  }
}
