import { FinancingCalculator, FinancingType } from './types';
import { MortgageCalculator } from './mortgage-calculator';
import { HELOCCalculator } from './heloc-calculator';
import { CashPurchaseCalculator } from './cash-calculator';

/**
 * Factory class for creating financing calculators
 * Implements the Factory pattern to create appropriate calculator instances
 */
export class FinancingFactory {
  private static calculators: Map<FinancingType, () => FinancingCalculator> =
    new Map([
      [FinancingType.MORTGAGE, () => new MortgageCalculator()],
      [FinancingType.HELOC, () => new HELOCCalculator()],
      [FinancingType.CASH, () => new CashPurchaseCalculator()]
    ] as Array<[FinancingType, () => FinancingCalculator]>);

  /**
   * Create a financing calculator based on the specified type
   */
  static createCalculator(type: FinancingType): FinancingCalculator {
    const calculatorFactory = this.calculators.get(type);

    if (!calculatorFactory) {
      throw new Error(`Unsupported financing type: ${type}`);
    }

    return calculatorFactory();
  }

  /**
   * Get all available financing types
   */
  static getAvailableTypes(): FinancingType[] {
    return Array.from(this.calculators.keys());
  }

  /**
   * Check if a financing type is supported
   */
  static isSupported(type: FinancingType): boolean {
    return this.calculators.has(type);
  }

  /**
   * Register a new financing calculator type
   * Allows for easy extension of the system
   */
  static registerCalculator(
    type: FinancingType,
    factory: () => FinancingCalculator
  ): void {
    this.calculators.set(type, factory);
  }

  /**
   * Create multiple calculators for comparison
   */
  static createMultipleCalculators(
    types: FinancingType[]
  ): Map<FinancingType, FinancingCalculator> {
    const calculators = new Map<FinancingType, FinancingCalculator>();

    for (const type of types) {
      calculators.set(type, this.createCalculator(type));
    }

    return calculators;
  }
}
