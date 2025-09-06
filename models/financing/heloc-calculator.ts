import {
  FinancingCalculator,
  FinancingParameters,
  FinancingResult,
  PaymentSchedule
} from './types';
import { BaseFinancingCalculator } from './base-calculator';

/**
 * Home Equity Line of Credit (HELOC) calculator
 * Handles interest-only payments during draw period, then principal + interest
 */
export class HELOCCalculator
  extends BaseFinancingCalculator
  implements FinancingCalculator
{
  private readonly DEFAULT_DRAW_PERIOD_YEARS = 10;
  private readonly DEFAULT_REPAYMENT_PERIOD_YEARS = 20;

  calculate(parameters: FinancingParameters): FinancingResult {
    this.validateParameters(parameters);

    const drawPeriodYears = this.DEFAULT_DRAW_PERIOD_YEARS;
    const repaymentPeriodYears = this.DEFAULT_REPAYMENT_PERIOD_YEARS;
    const currentBalance =
      parameters.currentBalance ||
      parameters.propertyPrice - parameters.downPayment;

    const monthlyRate = parameters.interestRate / 100 / this.MONTHS_PER_YEAR;

    // Interest-only payment during draw period
    const interestOnlyPayment = currentBalance * monthlyRate;

    // Principal + interest payment during repayment period
    const totalRepaymentPayments = repaymentPeriodYears * this.MONTHS_PER_YEAR;
    const principalInterestPayment = this.calculateMonthlyPayment(
      currentBalance,
      monthlyRate,
      totalRepaymentPayments
    );

    // Calculate total interest
    const drawPeriodPayments = drawPeriodYears * this.MONTHS_PER_YEAR;
    const drawPeriodInterest = interestOnlyPayment * drawPeriodPayments;
    const repaymentPeriodInterest = this.calculateTotalInterest(
      principalInterestPayment,
      totalRepaymentPayments,
      currentBalance
    );
    const totalInterest = drawPeriodInterest + repaymentPeriodInterest;

    // Generate amortization schedule
    const amortizationSchedule = this.generateHELOCAmortizationSchedule(
      currentBalance,
      monthlyRate,
      interestOnlyPayment,
      principalInterestPayment,
      drawPeriodYears,
      repaymentPeriodYears
    );

    return {
      monthlyPayment: interestOnlyPayment, // Current payment (interest-only)
      totalInterest,
      totalCost:
        parameters.propertyPrice +
        totalInterest +
        (parameters.additionalFees || 0),
      principalAmount: currentBalance,
      downPayment: parameters.downPayment,
      additionalFees: parameters.additionalFees || 0,
      amortizationSchedule
    };
  }

  getMonthlyPayment(parameters: FinancingParameters): number {
    this.validateParameters(parameters);

    const currentBalance =
      parameters.currentBalance ||
      parameters.propertyPrice - parameters.downPayment;
    const monthlyRate = parameters.interestRate / 100 / this.MONTHS_PER_YEAR;

    return currentBalance * monthlyRate; // Interest-only payment
  }

  getTotalInterest(parameters: FinancingParameters): number {
    const result = this.calculate(parameters);
    return result.totalInterest;
  }

  getAmortizationSchedule(parameters: FinancingParameters): PaymentSchedule[] {
    const result = this.calculate(parameters);
    return result.amortizationSchedule || [];
  }

  /**
   * Generate HELOC-specific amortization schedule
   */
  private generateHELOCAmortizationSchedule(
    principal: number,
    monthlyRate: number,
    interestOnlyPayment: number,
    principalInterestPayment: number,
    drawPeriodYears: number,
    repaymentPeriodYears: number
  ): PaymentSchedule[] {
    const schedule: PaymentSchedule[] = [];
    let remainingBalance = principal;
    const drawPeriodPayments = drawPeriodYears * this.MONTHS_PER_YEAR;
    const totalPayments =
      drawPeriodPayments + repaymentPeriodYears * this.MONTHS_PER_YEAR;

    for (
      let paymentNumber = 1;
      paymentNumber <= totalPayments;
      paymentNumber++
    ) {
      let principalPayment: number;
      let interestPayment: number;
      let totalPayment: number;

      if (paymentNumber <= drawPeriodPayments) {
        // Interest-only period
        interestPayment = remainingBalance * monthlyRate;
        principalPayment = 0;
        totalPayment = interestOnlyPayment;
      } else {
        // Principal + interest period
        interestPayment = remainingBalance * monthlyRate;
        principalPayment = principalInterestPayment - interestPayment;
        totalPayment = principalInterestPayment;
      }

      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      schedule.push({
        paymentNumber,
        principalPayment: Math.round(principalPayment * 100) / 100,
        interestPayment: Math.round(interestPayment * 100) / 100,
        remainingBalance: Math.round(remainingBalance * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100
      });
    }

    return schedule;
  }
}
