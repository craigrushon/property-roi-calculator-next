import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ControlledIncomeFields from './controlled-income-fields';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { Frequency } from '@prisma/client';

describe('ControlledIncomeFields', () => {
  const mockOnAddIncome = vi.fn();

  beforeEach(() => {
    mockOnAddIncome.mockClear();
  });

  it('renders amount input, frequency dropdown, and Add Income button', () => {
    render(<ControlledIncomeFields onAddIncome={mockOnAddIncome} />);

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

  it('updates the internal state when inputs change', async () => {
    const user = userEvent.setup();
    render(<ControlledIncomeFields onAddIncome={mockOnAddIncome} />);

    const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
    const frequencySelect = screen.getByRole('combobox', {
      name: /frequency/i
    });

    await user.type(amountInput, '2000');
    await user.selectOptions(frequencySelect, 'yearly');

    expect(amountInput).toHaveValue(2000);
    expect(frequencySelect).toHaveValue('yearly');
  });

  it('calls onAddIncome with the correct data when Add Income button is clicked', async () => {
    const user = userEvent.setup();
    render(<ControlledIncomeFields onAddIncome={mockOnAddIncome} />);

    const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
    const frequencySelect = screen.getByRole('combobox', {
      name: /frequency/i
    });
    const addButton = screen.getByRole('button', { name: /add income/i });

    await user.type(amountInput, '2000');
    await user.selectOptions(frequencySelect, 'yearly');
    await user.click(addButton);

    expect(mockOnAddIncome).toHaveBeenCalledTimes(1);
    expect(mockOnAddIncome).toHaveBeenCalledWith({
      amount: '2000',
      frequency: Frequency['yearly']
    });
  });

  it('resets the form fields after submitting an income', async () => {
    const user = userEvent.setup();
    render(<ControlledIncomeFields onAddIncome={mockOnAddIncome} />);

    const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
    const frequencySelect = screen.getByRole('combobox', {
      name: /frequency/i
    });
    const addButton = screen.getByRole('button', { name: /add income/i });

    await user.type(amountInput, '1500');
    await user.selectOptions(frequencySelect, 'yearly');
    await user.click(addButton);

    expect(amountInput).toHaveValue(null); // Spinbutton resets to empty
    expect(frequencySelect).toHaveValue(Frequency['monthly']);
  });
});
