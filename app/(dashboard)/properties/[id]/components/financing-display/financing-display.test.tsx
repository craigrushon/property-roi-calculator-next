import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FinancingDisplay } from '.';
import { FinancingType } from 'models/financing/types';

describe('FinancingDisplay', () => {
  const mockPropertyId = 1;
  const mockPropertyPrice = 500000;

  const mockCashFinancing = {
    type: FinancingType.CASH,
    parameters: {
      propertyPrice: 500000,
      downPayment: 500000,
      interestRate: 0,
      loanTermYears: 0,
      additionalFees: 5000,
      currentBalance: 0
    },
    result: {
      monthlyPayment: 0,
      totalInterest: 0,
      totalCost: 505000,
      principalAmount: 0,
      downPayment: 500000,
      additionalFees: 5000
    }
  };

  const mockMortgageFinancing = {
    type: FinancingType.MORTGAGE,
    parameters: {
      propertyPrice: 500000,
      downPayment: 100000,
      interestRate: 6.5,
      loanTermYears: 30,
      additionalFees: 5000,
      currentBalance: 0
    },
    result: {
      monthlyPayment: 2527,
      totalInterest: 509720,
      totalCost: 1014720,
      principalAmount: 400000,
      downPayment: 100000,
      additionalFees: 5000
    }
  };

  it('renders cash financing correctly', () => {
    render(
      <FinancingDisplay
        propertyId={mockPropertyId}
        propertyPrice={mockPropertyPrice}
        currentFinancing={mockCashFinancing}
      />
    );

    expect(screen.getByText('Financing')).toBeInTheDocument();
    expect(screen.getByText('Cash')).toBeInTheDocument();
    // Cash financing shows summary cards and detailed breakdown
    expect(screen.getByText('$505,000.00')).toBeInTheDocument(); // Total cost
    expect(screen.getByText('$500,000.00')).toBeInTheDocument(); // Down payment
  });

  it('renders mortgage financing correctly', () => {
    render(
      <FinancingDisplay
        propertyId={mockPropertyId}
        propertyPrice={mockPropertyPrice}
        currentFinancing={mockMortgageFinancing}
      />
    );

    expect(screen.getByText('Financing')).toBeInTheDocument();
    expect(screen.getByText('Mortgage')).toBeInTheDocument();
    // Mortgage financing shows summary cards and detailed breakdown
    expect(screen.getByText('$2,527.00')).toBeInTheDocument(); // Monthly payment
    expect(screen.getAllByText('$509,720.00')).toHaveLength(2); // Total interest appears in both summary and breakdown
    expect(screen.getByText('$1,014,720.00')).toBeInTheDocument(); // Total cost
    expect(screen.getAllByText('$400,000.00')).toHaveLength(2); // Principal amount appears in both summary and breakdown
  });

  it('renders empty state when no financing is provided', () => {
    render(
      <FinancingDisplay
        propertyId={mockPropertyId}
        propertyPrice={mockPropertyPrice}
        currentFinancing={undefined}
      />
    );

    expect(screen.getByText('Financing')).toBeInTheDocument();
    expect(screen.getByText('No financing configured')).toBeInTheDocument();
    expect(
      screen.getByText(
        'No financing information has been configured for this property.'
      )
    ).toBeInTheDocument();
  });

  it('renders empty state when financing has no parameters', () => {
    const financingWithoutParams = {
      ...mockCashFinancing,
      parameters: undefined
    } as any;

    render(
      <FinancingDisplay
        propertyId={mockPropertyId}
        propertyPrice={mockPropertyPrice}
        currentFinancing={financingWithoutParams}
      />
    );

    expect(screen.getByText('Invalid financing data')).toBeInTheDocument();
  });

  it('renders edit button with correct link', () => {
    render(
      <FinancingDisplay
        propertyId={mockPropertyId}
        propertyPrice={mockPropertyPrice}
        currentFinancing={mockCashFinancing}
      />
    );

    const editButton = screen.getByRole('link', { name: /edit/i });
    expect(editButton).toHaveAttribute(
      'href',
      '/properties/1/edit?focus=financing'
    );
  });

  it('handles zero values in parameters gracefully', () => {
    const financingWithZeros = {
      ...mockMortgageFinancing,
      parameters: {
        ...mockMortgageFinancing.parameters,
        interestRate: 0,
        loanTermYears: 0
      },
      result: {
        ...mockMortgageFinancing.result,
        monthlyPayment: 0,
        totalInterest: 0,
        totalCost: 0
      }
    };

    render(
      <FinancingDisplay
        propertyId={mockPropertyId}
        propertyPrice={mockPropertyPrice}
        currentFinancing={financingWithZeros}
      />
    );

    // With zero calculated values, they should show N/A
    expect(screen.getAllByText('N/A')).toHaveLength(4); // Monthly payment, total interest, total cost, principal amount
  });
});
