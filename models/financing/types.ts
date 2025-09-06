export interface FinancingParameters {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  additionalFees?: number;
  currentBalance?: number;
}

export interface FinancingResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  principalAmount: number;
  downPayment: number;
  additionalFees: number;
  amortizationSchedule?: PaymentSchedule[];
}

export interface PaymentSchedule {
  paymentNumber: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
  totalPayment: number;
}

export interface FinancingCalculator {
  calculate(parameters: FinancingParameters): FinancingResult;
  getMonthlyPayment(parameters: FinancingParameters): number;
  getTotalInterest(parameters: FinancingParameters): number;
  getAmortizationSchedule(parameters: FinancingParameters): PaymentSchedule[];
}

export enum FinancingType {
  MORTGAGE = 'mortgage',
  HELOC = 'heloc',
  CASH = 'cash'
}

export interface FinancingOption {
  type: FinancingType;
  parameters: FinancingParameters;
  result: FinancingResult;
}
