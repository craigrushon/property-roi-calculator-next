import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ControlledExpenseFields from './controlled-expense-fields';
import { describe, it, vi, expect, beforeEach } from 'vitest';

describe('ControlledExpenseFields', () => {
  const mockOnAddExpense = vi.fn();

  beforeEach(() => {
    mockOnAddExpense.mockClear();
  });

  it('renders all input fields with default values', () => {
    render(<ControlledExpenseFields onAddExpense={mockOnAddExpense} />);

    expect(screen.getByLabelText(/expense name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
    expect(screen.getByLabelText(/frequency/i)).toHaveValue('monthly');
  });

  it('validates inputs and shows an error for empty name', async () => {
    const user = userEvent.setup();
    render(<ControlledExpenseFields onAddExpense={mockOnAddExpense} />);

    await user.type(screen.getByLabelText(/amount/i), '100');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(
      screen.getByText(/please provide valid expense details/i)
    ).toBeInTheDocument();
    expect(mockOnAddExpense).not.toHaveBeenCalled();
  });

  it('validates inputs and shows an error for invalid amount', async () => {
    const user = userEvent.setup();
    render(<ControlledExpenseFields onAddExpense={mockOnAddExpense} />);

    await user.type(screen.getByLabelText(/expense name/i), 'Rent');
    await user.type(screen.getByLabelText(/amount/i), '-50');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(
      screen.getByText(/please provide valid expense details/i)
    ).toBeInTheDocument();
    expect(mockOnAddExpense).not.toHaveBeenCalled();
  });

  it('calls onAddExpense with valid inputs and clears the form', async () => {
    const user = userEvent.setup();
    render(<ControlledExpenseFields onAddExpense={mockOnAddExpense} />);

    await user.type(screen.getByLabelText(/expense name/i), 'Rent');
    await user.type(screen.getByLabelText(/amount/i), '500');
    await user.selectOptions(screen.getByLabelText(/frequency/i), 'yearly');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(mockOnAddExpense).toHaveBeenCalledWith({
      name: 'Rent',
      amount: '500',
      frequency: 'yearly'
    });

    // Verify form is reset
    expect(screen.getByLabelText(/expense name/i)).toHaveValue('');
    expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
    expect(screen.getByLabelText(/frequency/i)).toHaveValue('monthly');
  });

  it('clears error message on valid input', async () => {
    const user = userEvent.setup();
    render(<ControlledExpenseFields onAddExpense={mockOnAddExpense} />);

    await user.click(screen.getByRole('button', { name: /add expense/i }));
    expect(
      screen.getByText(/please provide valid expense details/i)
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/expense name/i), 'Rent');
    await user.type(screen.getByLabelText(/amount/i), '500');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(
      screen.queryByText(/please provide valid expense details/i)
    ).not.toBeInTheDocument();
  });
});
