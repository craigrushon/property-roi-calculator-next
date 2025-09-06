import {
  FinancingCalculator,
  FinancingParameters,
  FinancingResult,
  PaymentSchedule
} from './types';
import { BaseFinancingCalculator } from './base-calculator';

/**
 * Cash purchase calculator
 * Represents a property purchased entirely with cash (no financing)
 */
export class CashPurchaseCalculator
  extends BaseFinancingCalculator
  implements FinancingCalculator
{
  calculate(parameters: FinancingParameters): FinancingResult {
    this.validateParameters(parameters);

    // For cash purchases, there are no monthly payments or interest
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalCost: parameters.propertyPrice + (parameters.additionalFees || 0),
      principalAmount: 0,
      downPayment: parameters.propertyPrice,
      additionalFees: parameters.additionalFees || 0,
      amortizationSchedule: []
    };
  }

  getMonthlyPayment(parameters: FinancingParameters): number {
    return 0; // No monthly payments for cash purchases
  }

  getTotalInterest(parameters: FinancingParameters): number {
    return 0; // No interest for cash purchases
  }

  getAmortizationSchedule(parameters: FinancingParameters): PaymentSchedule[] {
    return []; // No payment schedule for cash purchases
  }

  /**
   * Calculate the opportunity cost of using cash vs. investing elsewhere
   * This helps compare cash purchase vs. financing + investing the difference
   */
  calculateOpportunityCost(
    parameters: FinancingParameters,
    alternativeInvestmentReturn: number,
    investmentPeriodYears: number = 30
  ): number {
    const cashUsed = parameters.propertyPrice;
    const futureValue =
      cashUsed *
      Math.pow(1 + alternativeInvestmentReturn / 100, investmentPeriodYears);
    return futureValue - cashUsed;
  }

  /**
   * Calculate break-even point for cash vs. financing
   * Returns the alternative investment return rate needed to break even
   */
  calculateBreakEvenReturnRate(
    parameters: FinancingParameters,
    mortgageCalculator: FinancingCalculator,
    investmentPeriodYears: number = 30
  ): number {
    const mortgageResult = mortgageCalculator.calculate(parameters);
    const totalMortgageCost = mortgageResult.totalCost;
    const cashCost = this.calculate(parameters).totalCost;
    const costDifference = totalMortgageCost - cashCost;

    if (costDifference <= 0) return 0;

    // Calculate required return rate: (FV/PV)^(1/n) - 1
    const requiredReturn =
      Math.pow(totalMortgageCost / cashCost, 1 / investmentPeriodYears) - 1;
    return requiredReturn * 100; // Convert to percentage
  }
}
