import { NormalizedExpense, NormalizedIncome } from './types';
import {
  FinancingCalculator,
  FinancingParameters,
  FinancingResult,
  FinancingType,
  FinancingOption
} from './financing';
import { FinancingFactory } from './financing';

export class Property {
  id: number;
  address: string;
  price: number;
  imageUrl: string | null;
  incomes: NormalizedIncome[] = [];
  expenses: NormalizedExpense[] = [];
  financing?: FinancingOption;

  constructor(
    id: number,
    address: string,
    price: number,
    imageUrl: string | null,
    incomes: NormalizedIncome[] = [],
    expenses: NormalizedExpense[] = [],
    financing?: FinancingOption
  ) {
    this.id = id;
    this.address = address;
    this.price = price;
    this.imageUrl = imageUrl;
    this.incomes = incomes;
    this.expenses = expenses;
    this.financing = financing;
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
    const regularExpenses = this.expenses.reduce((total, expense) => {
      const amount = Number(expense.amount);
      return total + (expense.frequency === 'yearly' ? amount / 12 : amount);
    }, 0);

    // Add financing expenses (mortgage payments, etc.)
    const financingExpenses = this.financing?.result.monthlyPayment || 0;

    return regularExpenses + financingExpenses;
  }

  calculateCashFlow(): number {
    return this.calculateMonthlyIncome() - this.calculateMonthlyExpenses();
  }

  calculateROI(): number {
    const annualCashFlow = this.calculateCashFlow() * 12;
    const totalInvestment = this.getTotalInvestment();
    return (annualCashFlow / totalInvestment) * 100;
  }

  /**
   * Get total investment amount (down payment + additional fees)
   */
  getTotalInvestment(): number {
    if (this.financing) {
      return (
        this.financing.result.downPayment + this.financing.result.additionalFees
      );
    }
    return this.price; // Cash purchase
  }

  /**
   * Add financing to the property
   */
  addFinancing(type: FinancingType, parameters: FinancingParameters): void {
    const calculator = FinancingFactory.createCalculator(type);
    const result = calculator.calculate(parameters);

    this.financing = {
      type,
      parameters,
      result
    };
  }

  /**
   * Remove financing (convert to cash purchase)
   */
  removeFinancing(): void {
    this.financing = undefined;
  }

  /**
   * Compare different financing options
   */
  compareFinancingOptions(
    parameters: FinancingParameters
  ): Map<FinancingType, FinancingResult> {
    const results = new Map<FinancingType, FinancingResult>();

    for (const type of FinancingFactory.getAvailableTypes()) {
      const calculator = FinancingFactory.createCalculator(type);
      const result = calculator.calculate(parameters);
      results.set(type, result);
    }

    return results;
  }

  /**
   * Get financing summary
   */
  getFinancingSummary(): string | null {
    if (!this.financing) return null;

    const { type, result } = this.financing;
    const monthlyPayment = result.monthlyPayment;
    const totalInterest = result.totalInterest;

    switch (type) {
      case FinancingType.MORTGAGE:
        return `Mortgage: $${monthlyPayment.toLocaleString()}/month, $${totalInterest.toLocaleString()} total interest`;
      case FinancingType.HELOC:
        return `HELOC: $${monthlyPayment.toLocaleString()}/month (interest-only), $${totalInterest.toLocaleString()} total interest`;
      case FinancingType.CASH:
        return `Cash Purchase: No monthly payments`;
      default:
        return `Financing: $${monthlyPayment.toLocaleString()}/month`;
    }
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
      expenses: this.expenses,
      financing: this.financing,
      totalInvestment: this.getTotalInvestment(),
      financingSummary: this.getFinancingSummary()
    };
  }
}
