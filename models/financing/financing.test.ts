import { describe, it, expect } from 'vitest';
import { FinancingFactory } from './financing-factory';
import { FinancingParameters, FinancingType } from './types';
import { Property } from '../property';

describe('Financing System', () => {
  const sampleParameters: FinancingParameters = {
    propertyPrice: 500000,
    downPayment: 100000,
    interestRate: 6.5,
    loanTermYears: 30,
    additionalFees: 5000
  };

  describe('MortgageCalculator', () => {
    it('should calculate monthly payment correctly', () => {
      const calculator = FinancingFactory.createCalculator(
        FinancingType.MORTGAGE
      );
      const result = calculator.calculate(sampleParameters);

      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.principalAmount).toBe(400000); // 500k - 100k down
      expect(result.downPayment).toBe(100000);
    });

    it('should generate amortization schedule', () => {
      const calculator = FinancingFactory.createCalculator(
        FinancingType.MORTGAGE
      );
      const schedule = calculator.getAmortizationSchedule(sampleParameters);

      expect(schedule).toHaveLength(360); // 30 years * 12 months
      expect(schedule[0].paymentNumber).toBe(1);
      expect(schedule[0].remainingBalance).toBeGreaterThan(0);
      expect(schedule[359].remainingBalance).toBe(0); // Loan is fully paid off
    });
  });

  describe('HELOCCalculator', () => {
    it('should calculate interest-only payment', () => {
      const calculator = FinancingFactory.createCalculator(FinancingType.HELOC);
      const result = calculator.calculate({
        ...sampleParameters,
        currentBalance: 400000
      });

      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
    });
  });

  describe('CashPurchaseCalculator', () => {
    it('should return zero payments for cash purchase', () => {
      const calculator = FinancingFactory.createCalculator(FinancingType.CASH);
      const result = calculator.calculate(sampleParameters);

      expect(result.monthlyPayment).toBe(0);
      expect(result.totalInterest).toBe(0);
      expect(result.downPayment).toBe(500000);
      expect(result.totalCost).toBe(505000); // price + fees
    });
  });

  describe('Property Integration', () => {
    it('should integrate financing with property calculations', () => {
      const property = new Property(
        1,
        '123 Test St',
        500000,
        null,
        [
          {
            id: 1,
            amount: 3000,
            frequency: 'monthly',
            propertyId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ], // income
        [
          {
            id: 1,
            name: 'Insurance',
            amount: 200,
            frequency: 'monthly',
            propertyId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ] // expenses
      );

      // Add mortgage financing
      property.addFinancing(FinancingType.MORTGAGE, sampleParameters);

      expect(property.financing).toBeDefined();
      expect(property.financing?.type).toBe(FinancingType.MORTGAGE);
      expect(property.calculateMonthlyExpenses()).toBeGreaterThan(200); // includes mortgage payment
      expect(property.getTotalInvestment()).toBe(105000); // down payment + fees
    });

    it('should compare financing options', () => {
      const property = new Property(1, '123 Test St', 500000, null);
      const comparison = property.compareFinancingOptions(sampleParameters);

      expect(comparison.has(FinancingType.MORTGAGE)).toBe(true);
      expect(comparison.has(FinancingType.HELOC)).toBe(true);
      expect(comparison.has(FinancingType.CASH)).toBe(true);

      const mortgageResult = comparison.get(FinancingType.MORTGAGE);
      const cashResult = comparison.get(FinancingType.CASH);

      expect(mortgageResult?.monthlyPayment).toBeGreaterThan(0);
      expect(cashResult?.monthlyPayment).toBe(0);
    });
  });

  describe('FinancingFactory', () => {
    it('should create correct calculator types', () => {
      const mortgageCalc = FinancingFactory.createCalculator(
        FinancingType.MORTGAGE
      );
      const helocCalc = FinancingFactory.createCalculator(FinancingType.HELOC);
      const cashCalc = FinancingFactory.createCalculator(FinancingType.CASH);

      expect(mortgageCalc).toBeDefined();
      expect(helocCalc).toBeDefined();
      expect(cashCalc).toBeDefined();
    });

    it('should return available types', () => {
      const types = FinancingFactory.getAvailableTypes();
      expect(types).toContain(FinancingType.MORTGAGE);
      expect(types).toContain(FinancingType.HELOC);
      expect(types).toContain(FinancingType.CASH);
    });
  });
});
