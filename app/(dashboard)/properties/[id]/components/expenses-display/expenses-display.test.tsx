import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExpensesDisplay } from '.';
import { Expense } from 'models/types';

describe('ExpensesDisplay', () => {
  const mockPropertyId = 1;

  const mockExpenses: Expense[] = [
    { id: 1, name: 'Property Taxes', amount: 3500, frequency: 'yearly' },
    { id: 2, name: 'Insurance', amount: 1200, frequency: 'yearly' },
    { id: 3, name: 'Utilities', amount: 200, frequency: 'monthly' }
  ];

  it('renders expenses correctly', () => {
    render(
      <ExpensesDisplay propertyId={mockPropertyId} expenses={mockExpenses} />
    );

    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Property Taxes')).toBeInTheDocument();
    expect(screen.getByText('Insurance')).toBeInTheDocument();
    expect(screen.getByText('Utilities')).toBeInTheDocument();
    expect(screen.getByText('$3,500.00 Yearly')).toBeInTheDocument();
    expect(screen.getByText('$1,200.00 Yearly')).toBeInTheDocument();
    expect(screen.getByText('$200.00 Monthly')).toBeInTheDocument();
  });

  it('renders empty state when no expenses are provided', () => {
    render(<ExpensesDisplay propertyId={mockPropertyId} expenses={[]} />);

    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('No Expenses')).toBeInTheDocument();
    expect(
      screen.getByText('No expenses have been configured for this property.')
    ).toBeInTheDocument();
    expect(screen.getByText('No expenses configured')).toBeInTheDocument();
  });

  it('renders edit button with correct link', () => {
    render(
      <ExpensesDisplay propertyId={mockPropertyId} expenses={mockExpenses} />
    );

    const editButton = screen.getByRole('link', { name: /edit/i });
    expect(editButton).toHaveAttribute(
      'href',
      '/properties/1/edit?focus=expenses'
    );
  });

  it('formats currency correctly for different amounts', () => {
    const largeExpense: Expense[] = [
      { id: 1, name: 'Major Renovation', amount: 50000, frequency: 'yearly' }
    ];

    render(
      <ExpensesDisplay propertyId={mockPropertyId} expenses={largeExpense} />
    );

    expect(screen.getByText('$50,000.00 Yearly')).toBeInTheDocument();
  });

  it('capitalizes frequency correctly', () => {
    const expensesWithLowercase: Expense[] = [
      { id: 1, name: 'Maintenance', amount: 500, frequency: 'monthly' },
      { id: 2, name: 'HOA Fees', amount: 300, frequency: 'yearly' }
    ];

    render(
      <ExpensesDisplay
        propertyId={mockPropertyId}
        expenses={expensesWithLowercase}
      />
    );

    expect(screen.getByText('$500.00 Monthly')).toBeInTheDocument();
    expect(screen.getByText('$300.00 Yearly')).toBeInTheDocument();
  });

  it('renders expense names correctly', () => {
    const expensesWithSpecialNames: Expense[] = [
      {
        id: 1,
        name: 'Property Management (8%)',
        amount: 2000,
        frequency: 'monthly'
      },
      { id: 2, name: 'HOA & Maintenance', amount: 150, frequency: 'monthly' }
    ];

    render(
      <ExpensesDisplay
        propertyId={mockPropertyId}
        expenses={expensesWithSpecialNames}
      />
    );

    expect(screen.getByText('Property Management (8%)')).toBeInTheDocument();
    expect(screen.getByText('HOA & Maintenance')).toBeInTheDocument();
  });

  it('handles single expense correctly', () => {
    const singleExpense: Expense[] = [
      { id: 1, name: 'Property Tax', amount: 2500, frequency: 'yearly' }
    ];

    render(
      <ExpensesDisplay propertyId={mockPropertyId} expenses={singleExpense} />
    );

    expect(screen.getByText('Property Tax')).toBeInTheDocument();
    expect(screen.getByText('$2,500.00 Yearly')).toBeInTheDocument();
    expect(screen.queryByText('Unit #')).not.toBeInTheDocument(); // Should not show unit numbers for expenses
  });
});
