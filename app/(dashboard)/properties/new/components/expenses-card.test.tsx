import { render, screen, fireEvent } from '@testing-library/react';
import ExpensesCard from './expenses-card';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { Frequency } from '@prisma/client';
import { Expense } from 'app/(dashboard)/properties/actions';

describe('ExpensesCard', () => {
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnPrev = vi.fn();

  const initialExpenses: Expense[] = [];

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnSubmit.mockClear();
    mockOnPrev.mockClear();
  });

  it('renders ExpenseForm and navigation buttons', () => {
    render(
      <ExpensesCard
        expenses={initialExpenses}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onPrev={mockOnPrev}
      />
    );

    expect(screen.getByText(/step 3: expense details/i)).toBeInTheDocument();
    expect(
      screen.getByText(/list the property's recurring expenses/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: /expense name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /go to previous step/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /submit expense information/i })
    ).toBeInTheDocument();
  });

  it('calls onChange with new expense data when Add Expense is clicked', () => {
    render(
      <ExpensesCard
        expenses={initialExpenses}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onPrev={mockOnPrev}
      />
    );

    fireEvent.change(screen.getByRole('textbox', { name: /expense name/i }), {
      target: { value: 'Utilities', id: 'name' }
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '150', id: 'amount' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'monthly', id: 'frequency' }
    });

    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      expenses: [
        { name: 'Utilities', amount: 150, frequency: Frequency['monthly'] }
      ]
    });
  });

  it('calls onSubmit when Submit button is clicked', () => {
    render(
      <ExpensesCard
        expenses={initialExpenses}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onPrev={mockOnPrev}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: /submit expense information/i })
    );
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onPrev when Previous button is clicked', () => {
    render(
      <ExpensesCard
        expenses={initialExpenses}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onPrev={mockOnPrev}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: /go to previous step/i })
    );
    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });
});
