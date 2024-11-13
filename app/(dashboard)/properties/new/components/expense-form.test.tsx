import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseForm from './expense-form';
import { Frequency } from '@prisma/client';
import { describe, it, vi, expect, beforeEach } from 'vitest';

describe('ExpenseForm', () => {
  const mockOnChange = vi.fn();
  const mockOnAddExpense = vi.fn();
  const initialExpense = {
    amount: '',
    frequency: Frequency['monthly'],
    name: ''
  };

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnAddExpense.mockClear();
  });

  it('renders input fields and Add Expense button', () => {
    render(
      <ExpenseForm
        expense={initialExpense}
        onChange={mockOnChange}
        onAddExpense={mockOnAddExpense}
      />
    );

    expect(
      screen.getByRole('textbox', { name: /expense name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /amount/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /frequency/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add expense/i })
    ).toBeInTheDocument();
  });

  it('calls onChange with id and value when inputs change', () => {
    render(
      <ExpenseForm
        expense={initialExpense}
        onChange={mockOnChange}
        onAddExpense={mockOnAddExpense}
      />
    );

    fireEvent.change(screen.getByRole('textbox', { name: /expense name/i }), {
      target: { value: 'Rent', id: 'name' }
    });
    expect(mockOnChange).toHaveBeenCalledWith('name', 'Rent');

    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '500', id: 'amount' }
    });
    expect(mockOnChange).toHaveBeenCalledWith('amount', '500');

    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'yearly', id: 'frequency' }
    });
    expect(mockOnChange).toHaveBeenCalledWith('frequency', 'yearly');
  });

  it('calls onAddExpense when Add Expense button is clicked', () => {
    render(
      <ExpenseForm
        expense={initialExpense}
        onChange={mockOnChange}
        onAddExpense={mockOnAddExpense}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
    expect(mockOnAddExpense).toHaveBeenCalledTimes(1);
  });
});
