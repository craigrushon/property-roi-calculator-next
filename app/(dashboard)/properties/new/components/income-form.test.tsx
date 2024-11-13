import { render, screen, fireEvent } from '@testing-library/react';
import IncomeForm from './income-form';
import { Frequency } from '@prisma/client';
import { describe, it, vi, expect, beforeEach } from 'vitest';

describe('IncomeForm', () => {
  const mockOnChange = vi.fn();
  const mockOnAddIncome = vi.fn();
  const initialIncome = { amount: '', frequency: Frequency['monthly'] };

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnAddIncome.mockClear();
  });

  it('renders amount input, frequency dropdown, and Add Income button', () => {
    render(
      <IncomeForm
        income={initialIncome}
        onChange={mockOnChange}
        onAddIncome={mockOnAddIncome}
      />
    );

    const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
    expect(amountInput).toBeInTheDocument();
    expect(amountInput).toHaveAttribute('placeholder', 'Enter income amount');

    const frequencySelect = screen.getByRole('combobox', {
      name: /frequency/i
    });
    expect(frequencySelect).toBeInTheDocument();
    expect(frequencySelect).toHaveDisplayValue('Monthly');

    const addButton = screen.getByRole('button', { name: /add income/i });
    expect(addButton).toBeInTheDocument();
  });

  it('calls onChange with id and value when amount input changes', () => {
    render(
      <IncomeForm
        income={initialIncome}
        onChange={mockOnChange}
        onAddIncome={mockOnAddIncome}
      />
    );

    const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
    fireEvent.change(amountInput, { target: { value: '2000', id: 'amount' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('amount', '2000');
  });

  it('calls onChange with id and value when frequency dropdown changes', () => {
    render(
      <IncomeForm
        income={initialIncome}
        onChange={mockOnChange}
        onAddIncome={mockOnAddIncome}
      />
    );

    const frequencySelect = screen.getByRole('combobox', {
      name: /frequency/i
    });
    fireEvent.change(frequencySelect, {
      target: { value: 'yearly', id: 'frequency' }
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('frequency', 'yearly');
  });

  it('calls onAddIncome when Add Income button is clicked', () => {
    render(
      <IncomeForm
        income={initialIncome}
        onChange={mockOnChange}
        onAddIncome={mockOnAddIncome}
      />
    );

    const addButton = screen.getByRole('button', { name: /add income/i });
    fireEvent.click(addButton);

    expect(mockOnAddIncome).toHaveBeenCalledTimes(1);
  });

  it('displays initial income data in inputs', () => {
    const populatedIncome = { amount: '1500', frequency: Frequency['yearly'] };
    render(
      <IncomeForm
        income={populatedIncome}
        onChange={mockOnChange}
        onAddIncome={mockOnAddIncome}
      />
    );

    const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
    expect(amountInput).toHaveValue(1500);

    const frequencySelect = screen.getByRole('combobox', {
      name: /frequency/i
    });
    expect(frequencySelect).toHaveDisplayValue('Yearly');
  });
});
