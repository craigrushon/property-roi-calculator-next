import { NormalizedExpense, NormalizedIncome } from './types';

export class Property {
  id: number;
  address: string;
  price: number;
  imageUrl: string | null;
  incomes: NormalizedIncome[] = [];
  expenses: NormalizedExpense[] = [];

  constructor(
    id: number,
    address: string,
    price: number,
    imageUrl: string | null,
    incomes: NormalizedIncome[] = [],
    expenses: NormalizedExpense[] = []
  ) {
    this.id = id;
    this.address = address;
    this.price = price;
    this.imageUrl = imageUrl;
    this.incomes = incomes;
    this.expenses = expenses;
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
        (income.frequency === 'yearly'
          ? Number(income.amount) / 12
          : Number(income.amount))
      );
    }, 0);
  }

  calculateMonthlyExpenses(): number {
    return this.expenses.reduce((total, expense) => {
      const amount = Number(expense.amount);
      return total + (expense.frequency === 'yearly' ? amount / 12 : amount);
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
      imageUrl: this.imageUrl,
      incomes: this.incomes,
      expenses: this.expenses
    };
  }
}
