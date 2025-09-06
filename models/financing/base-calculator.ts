import { FinancingParameters, FinancingResult, PaymentSchedule } from './types';

/**
 * Abstract base class for financing calculations
 * Implements common calculation logic while allowing specific implementations
 * to override behavior as needed
 */
export abstract class BaseFinancingCalculator {
  protected readonly MONTHS_PER_YEAR = 12;

  /**
   * Calculate monthly payment using the standard mortgage formula
   * P * [r(1+r)^n] / [(1+r)^n - 1]
   * Where:
   * P = Principal loan amount
   * r = Monthly interest rate
   * n = Total number of payments
   */
  protected calculateMonthlyPayment(
    principal: number,
    monthlyRate: number,
    totalPayments: number
  ): number {
    if (monthlyRate === 0) {
      return principal / totalPayments;
    }

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    return Math.round(monthlyPayment * 100) / 100;
  }

  /**
   * Calculate total interest paid over the life of the loan
   */
  protected calculateTotalInterest(
    monthlyPayment: number,
    totalPayments: number,
    principal: number
  ): number {
    return monthlyPayment * totalPayments - principal;
  }

  /**
   * Generate amortization schedule
   */
  protected generateAmortizationSchedule(
    principal: number,
    monthlyRate: number,
    monthlyPayment: number,
    totalPayments: number
  ): PaymentSchedule[] {
    const schedule: PaymentSchedule[] = [];
    let remainingBalance = principal;

    for (
      let paymentNumber = 1;
      paymentNumber <= totalPayments;
      paymentNumber++
    ) {
      const interestPayment = remainingBalance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;

      // For the last payment, adjust to ensure balance goes to zero
      if (paymentNumber === totalPayments) {
        principalPayment = remainingBalance;
      }

      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      schedule.push({
        paymentNumber,
        principalPayment: Math.round(principalPayment * 100) / 100,
        interestPayment: Math.round(interestPayment * 100) / 100,
        remainingBalance: Math.round(remainingBalance * 100) / 100,
        totalPayment:
          paymentNumber === totalPayments
            ? Math.round((principalPayment + interestPayment) * 100) / 100
            : monthlyPayment
      });
    }

    return schedule;
  }

  /**
   * Validate financing parameters
   */
  protected validateParameters(parameters: FinancingParameters): void {
    if (parameters.propertyPrice <= 0) {
      throw new Error('Property price must be greater than 0');
    }
    if (parameters.downPayment < 0) {
      throw new Error('Down payment cannot be negative');
    }
    if (parameters.downPayment >= parameters.propertyPrice) {
      throw new Error('Down payment must be less than property price');
    }
    if (parameters.interestRate < 0) {
      throw new Error('Interest rate cannot be negative');
    }
    if (parameters.loanTermYears <= 0) {
      throw new Error('Loan term must be greater than 0 years');
    }
  }
}
