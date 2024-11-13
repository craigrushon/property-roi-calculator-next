import { render, screen, fireEvent } from '@testing-library/react';
import IncomesCard from 'app/(dashboard)/properties/new/components/incomes-card';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { Frequency } from '@prisma/client';
import { PropertyData } from 'app/(dashboard)/properties/new/components/property-onboarding';

describe('IncomesCard', () => {
  const mockOnChange = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnPrev = vi.fn();

  const initialIncomes: PropertyData['incomes'] = [];

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnNext.mockClear();
    mockOnPrev.mockClear();
  });

  it('renders IncomeInfoForm with text and navigation buttons', () => {
    render(
      <IncomesCard
        incomes={initialIncomes}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    expect(screen.getByText(/step 2: income details/i)).toBeInTheDocument();
    expect(
      screen.getByText(/provide details about the property's income sources/i)
    ).toBeInTheDocument();

    // Verify IncomeInfoForm renders
    expect(
      screen.getByRole('spinbutton', { name: /amount/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /frequency/i })
    ).toBeInTheDocument();

    // Verify navigation buttons render
    expect(
      screen.getByRole('button', { name: /go to previous step/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /go to next step/i })
    ).toBeInTheDocument();
  });

  it('calls onChange with new income data when Add Income is clicked', () => {
    render(
      <IncomesCard
        incomes={initialIncomes}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    // Simulate entering income details in IncomeForm (already tested in isolation)
    const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
    fireEvent.change(amountInput, { target: { value: '2000' } });

    const frequencySelect = screen.getByRole('combobox', {
      name: /frequency/i
    });
    fireEvent.change(frequencySelect, { target: { value: 'yearly' } });

    // Click "Add Income" button
    const addButton = screen.getByRole('button', { name: /add income/i });
    fireEvent.click(addButton);

    // Verify onChange is called with the updated incomes array
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      incomes: [{ amount: 2000, frequency: Frequency['yearly'] }]
    });
  });

  it('calls onNext when Next button is clicked', () => {
    render(
      <IncomesCard
        incomes={initialIncomes}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    const nextButton = screen.getByRole('button', { name: /go to next step/i });
    fireEvent.click(nextButton);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onPrev when Previous button is clicked', () => {
    render(
      <IncomesCard
        incomes={initialIncomes}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    const prevButton = screen.getByRole('button', {
      name: /go to previous step/i
    });
    fireEvent.click(prevButton);

    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });
});
