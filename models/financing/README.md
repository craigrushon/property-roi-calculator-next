# Financing System Documentation

This document provides comprehensive examples and usage patterns for the property financing system.

## Overview

The financing system provides a SOLID-compliant architecture for calculating various property financing options including mortgages, HELOCs, and cash purchases. It integrates seamlessly with the Property model to automatically recalculate ROI and cash flow.

## Core Components

- **FinancingCalculator Interface**: Polymorphic interface for all financing types
- **BaseFinancingCalculator**: Common calculation logic and validation
- **MortgageCalculator**: Standard mortgage with amortization schedules
- **HELOCCalculator**: Interest-only draw period + repayment
- **CashPurchaseCalculator**: Cash purchases with opportunity cost analysis
- **FinancingFactory**: Factory pattern for calculator creation

## Usage Examples

### 1. Basic Financing Comparison

```typescript
import { Property } from '../property';
import { FinancingType, FinancingParameters } from './types';
import { FinancingFactory } from './financing-factory';

// Sample property data
const propertyPrice = 500000;
const downPayment = 100000;
const interestRate = 6.5;
const loanTermYears = 30;

const parameters: FinancingParameters = {
  propertyPrice,
  downPayment,
  interestRate,
  loanTermYears,
  additionalFees: 5000
};

// Create property
const property = new Property(
  1,
  '123 Main Street',
  propertyPrice,
  null,
  [], // incomes
  [] // expenses
);

// Compare all financing options
const comparison = property.compareFinancingOptions(parameters);

for (const [type, result] of comparison) {
  console.log(`${type.toUpperCase()}:`);
  console.log(`  Monthly Payment: $${result.monthlyPayment.toLocaleString()}`);
  console.log(`  Total Interest: $${result.totalInterest.toLocaleString()}`);
  console.log(`  Total Cost: $${result.totalCost.toLocaleString()}`);
  console.log(`  Down Payment: $${result.downPayment.toLocaleString()}`);
}

// Add mortgage financing to property
property.addFinancing(FinancingType.MORTGAGE, parameters);
console.log(`Property ROI with Mortgage: ${property.returnOnInvestment.toFixed(2)}%`);
console.log(`Monthly Cash Flow: $${property.cashflow.toLocaleString()}`);
console.log(`Total Investment: $${property.getTotalInvestment().toLocaleString()}`);
```

### 2. Detailed Mortgage Analysis

```typescript
const parameters: FinancingParameters = {
  propertyPrice: 750000,
  downPayment: 150000,
  interestRate: 7.2,
  loanTermYears: 30,
  additionalFees: 8000
};

const mortgageCalculator = FinancingFactory.createCalculator(FinancingType.MORTGAGE);
const result = mortgageCalculator.calculate(parameters);

console.log('Mortgage Details:');
console.log(`Principal Amount: $${result.principalAmount.toLocaleString()}`);
console.log(`Monthly Payment: $${result.monthlyPayment.toLocaleString()}`);
console.log(`Total Interest: $${result.totalInterest.toLocaleString()}`);
console.log(`Total Cost: $${result.totalCost.toLocaleString()}`);

// Show first 12 months of amortization
if (result.amortizationSchedule) {
  console.log('\nFirst 12 Months Amortization:');
  console.log('Month | Principal | Interest | Balance');
  
  for (let i = 0; i < Math.min(12, result.amortizationSchedule.length); i++) {
    const payment = result.amortizationSchedule[i];
    console.log(
      `${payment.paymentNumber.toString().padStart(5)} | ` +
      `$${payment.principalPayment.toLocaleString().padStart(9)} | ` +
      `$${payment.interestPayment.toLocaleString().padStart(9)} | ` +
      `$${payment.remainingBalance.toLocaleString()}`
    );
  }
}
```

### 3. HELOC Analysis

```typescript
const parameters: FinancingParameters = {
  propertyPrice: 600000,
  downPayment: 120000,
  interestRate: 8.5,
  loanTermYears: 30,
  additionalFees: 3000,
  currentBalance: 480000
};

const helocCalculator = FinancingFactory.createCalculator(FinancingType.HELOC);
const result = helocCalculator.calculate(parameters);

console.log('HELOC Details:');
console.log(`Current Balance: $${parameters.currentBalance?.toLocaleString()}`);
console.log(`Interest-Only Payment: $${result.monthlyPayment.toLocaleString()}`);
console.log(`Total Interest: $${result.totalInterest.toLocaleString()}`);
console.log(`Total Cost: $${result.totalCost.toLocaleString()}`);
```

### 4. Cash vs Financing Comparison

```typescript
const parameters: FinancingParameters = {
  propertyPrice: 400000,
  downPayment: 80000,
  interestRate: 6.8,
  loanTermYears: 30,
  additionalFees: 4000
};

const cashCalculator = FinancingFactory.createCalculator(FinancingType.CASH) as CashPurchaseCalculator;
const mortgageCalculator = FinancingFactory.createCalculator(FinancingType.MORTGAGE);

const cashResult = cashCalculator.calculate(parameters);
const mortgageResult = mortgageCalculator.calculate(parameters);

console.log('Cash Purchase:');
console.log(`  Total Cost: $${cashResult.totalCost.toLocaleString()}`);
console.log(`  Monthly Payment: $${cashResult.monthlyPayment.toLocaleString()}`);

console.log('\nMortgage:');
console.log(`  Total Cost: $${mortgageResult.totalCost.toLocaleString()}`);
console.log(`  Monthly Payment: $${mortgageResult.monthlyPayment.toLocaleString()}`);
console.log(`  Down Payment: $${mortgageResult.downPayment.toLocaleString()}`);

const costDifference = mortgageResult.totalCost - cashResult.totalCost;
console.log(`\nCost Difference: $${costDifference.toLocaleString()}`);

// Calculate opportunity cost
const opportunityCost = cashCalculator.calculateOpportunityCost(
  parameters,
  8, // 8% alternative investment return
  30 // 30 years
);

console.log(`\nOpportunity Cost (8% return for 30 years): $${opportunityCost.toLocaleString()}`);
console.log(`Net Benefit of Cash: $${(opportunityCost - costDifference).toLocaleString()}`);
```

## Property Integration

The financing system integrates seamlessly with the Property model:

```typescript
// Add financing to a property
property.addFinancing(FinancingType.MORTGAGE, parameters);

// Remove financing (convert to cash purchase)
property.removeFinancing();

// Get financing summary
const summary = property.getFinancingSummary();
console.log(summary); // "Mortgage: $2,528/month, $410,080 total interest"

// Compare multiple financing options
const comparison = property.compareFinancingOptions(parameters);
```

## Key Features

- **SOLID Principles**: Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion
- **Factory Pattern**: Easy calculator creation and extension
- **Comprehensive Calculations**: Amortization schedules, opportunity costs, break-even analysis
- **Property Integration**: Automatic ROI and cash flow recalculation
- **Type Safety**: Full TypeScript support with proper interfaces
- **Extensible**: Easy to add new financing types

## Testing

The system includes comprehensive unit tests covering:
- All calculator types and their calculations
- Amortization schedule accuracy
- Property integration scenarios
- Factory pattern functionality
- Edge cases and validation

Run tests with:
```bash
npm test models/financing/financing.test.ts
```
