import {
  FinancingCalculator,
  FinancingParameters,
  FinancingResult,
  PaymentSchedule
} from './types';
import { BaseFinancingCalculator } from './base-calculator';

/**
 * Standard mortgage calculator implementation
 * Handles conventional mortgages with fixed interest rates
 */
export class MortgageCalculator
  extends BaseFinancingCalculator
  implements FinancingCalculator
{
  calculate(parameters: FinancingParameters): FinancingResult {
    this.validateParameters(parameters);

    const principal = parameters.propertyPrice - parameters.downPayment;
    const monthlyRate = parameters.interestRate / 100 / this.MONTHS_PER_YEAR;
    const totalPayments = parameters.loanTermYears * this.MONTHS_PER_YEAR;

    const monthlyPayment = this.calculateMonthlyPayment(
      principal,
      monthlyRate,
      totalPayments
    );
    const totalInterest = this.calculateTotalInterest(
      monthlyPayment,
      totalPayments,
      principal
    );
    const amortizationSchedule = this.generateAmortizationSchedule(
      principal,
      monthlyRate,
      monthlyPayment,
      totalPayments
    );

    return {
      monthlyPayment,
      totalInterest,
      totalCost:
        parameters.propertyPrice +
        totalInterest +
        (parameters.additionalFees || 0),
      principalAmount: principal,
      downPayment: parameters.downPayment,
      additionalFees: parameters.additionalFees || 0,
      amortizationSchedule
    };
  }

  getMonthlyPayment(parameters: FinancingParameters): number {
    this.validateParameters(parameters);

    const principal = parameters.propertyPrice - parameters.downPayment;
    const monthlyRate = parameters.interestRate / 100 / this.MONTHS_PER_YEAR;
    const totalPayments = parameters.loanTermYears * this.MONTHS_PER_YEAR;

    return this.calculateMonthlyPayment(principal, monthlyRate, totalPayments);
  }

  getTotalInterest(parameters: FinancingParameters): number {
    const monthlyPayment = this.getMonthlyPayment(parameters);
    const principal = parameters.propertyPrice - parameters.downPayment;
    const totalPayments = parameters.loanTermYears * this.MONTHS_PER_YEAR;

    return this.calculateTotalInterest(
      monthlyPayment,
      totalPayments,
      principal
    );
  }

  getAmortizationSchedule(parameters: FinancingParameters): PaymentSchedule[] {
    this.validateParameters(parameters);

    const principal = parameters.propertyPrice - parameters.downPayment;
    const monthlyRate = parameters.interestRate / 100 / this.MONTHS_PER_YEAR;
    const totalPayments = parameters.loanTermYears * this.MONTHS_PER_YEAR;
    const monthlyPayment = this.calculateMonthlyPayment(
      principal,
      monthlyRate,
      totalPayments
    );

    return this.generateAmortizationSchedule(
      principal,
      monthlyRate,
      monthlyPayment,
      totalPayments
    );
  }

  /**
   * Calculate how much principal is paid off by a specific payment number
   */
  getPrincipalPaidByPayment(
    parameters: FinancingParameters,
    paymentNumber: number
  ): number {
    const schedule = this.getAmortizationSchedule(parameters);
    return schedule
      .slice(0, paymentNumber)
      .reduce((total, payment) => total + payment.principalPayment, 0);
  }

  /**
   * Calculate remaining balance after a specific payment number
   */
  getRemainingBalanceAfterPayment(
    parameters: FinancingParameters,
    paymentNumber: number
  ): number {
    const schedule = this.getAmortizationSchedule(parameters);
    if (paymentNumber >= schedule.length) return 0;
    return schedule[paymentNumber - 1].remainingBalance;
  }
}
