import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IncomesDisplay } from '.';
import { Income } from 'models/types';

describe('IncomesDisplay', () => {
  const mockPropertyId = 1;

  const mockIncomes: Income[] = [
    { id: 1, amount: 2000, frequency: 'monthly' },
    { id: 2, amount: 24000, frequency: 'yearly' }
  ];

  it('renders income streams correctly', () => {
    render(
      <IncomesDisplay propertyId={mockPropertyId} incomes={mockIncomes} />
    );

    expect(screen.getByText('Income Streams')).toBeInTheDocument();
    expect(screen.getByText('Unit #1')).toBeInTheDocument();
    expect(screen.getByText('Unit #2')).toBeInTheDocument();
    expect(screen.getByText('$2,000.00 Monthly')).toBeInTheDocument();
    expect(screen.getByText('$24,000.00 Yearly')).toBeInTheDocument();
  });

  it('renders empty state when no incomes are provided', () => {
    render(<IncomesDisplay propertyId={mockPropertyId} incomes={[]} />);

    expect(screen.getByText('Income Streams')).toBeInTheDocument();
    expect(screen.getByText('No Income Streams')).toBeInTheDocument();
    expect(
      screen.getByText(
        'No income streams have been configured for this property.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('No income configured')).toBeInTheDocument();
  });

  it('renders edit button with correct link', () => {
    render(
      <IncomesDisplay propertyId={mockPropertyId} incomes={mockIncomes} />
    );

    const editButton = screen.getByRole('link', { name: /edit/i });
    expect(editButton).toHaveAttribute(
      'href',
      '/properties/1/edit?focus=incomes'
    );
  });

  it('formats currency correctly for different amounts', () => {
    const largeIncome: Income[] = [
      { id: 1, amount: 150000, frequency: 'yearly' }
    ];

    render(
      <IncomesDisplay propertyId={mockPropertyId} incomes={largeIncome} />
    );

    expect(screen.getByText('$150,000.00 Yearly')).toBeInTheDocument();
  });

  it('capitalizes frequency correctly', () => {
    const incomesWithLowercase: Income[] = [
      { id: 1, amount: 1000, frequency: 'monthly' },
      { id: 2, amount: 12000, frequency: 'yearly' }
    ];

    render(
      <IncomesDisplay
        propertyId={mockPropertyId}
        incomes={incomesWithLowercase}
      />
    );

    expect(screen.getByText('$1,000.00 Monthly')).toBeInTheDocument();
    expect(screen.getByText('$12,000.00 Yearly')).toBeInTheDocument();
  });

  it('renders multiple income streams with correct numbering', () => {
    const multipleIncomes: Income[] = [
      { id: 1, amount: 1500, frequency: 'monthly' },
      { id: 2, amount: 1800, frequency: 'monthly' },
      { id: 3, amount: 2000, frequency: 'monthly' }
    ];

    render(
      <IncomesDisplay propertyId={mockPropertyId} incomes={multipleIncomes} />
    );

    expect(screen.getByText('Unit #1')).toBeInTheDocument();
    expect(screen.getByText('Unit #2')).toBeInTheDocument();
    expect(screen.getByText('Unit #3')).toBeInTheDocument();
  });
});
