import { render, screen, waitFor } from '@testing-library/react';
import ExpenseRow from './expense-row';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import * as actions from '../../../actions';
import { Expense } from 'models/types';

describe('ExpenseRow', () => {
  const mockExpense: Expense = {
    id: 1,
    name: 'Utilities',
    amount: 150,
    frequency: 'monthly'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders expense details', () => {
    render(<ExpenseRow expense={mockExpense} />);

    expect(screen.getByText(/utilities/i)).toBeInTheDocument();
    expect(screen.getByText(/\$150/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
  });

  it('toggles to edit mode when Edit is clicked', async () => {
    const user = userEvent.setup();

    render(<ExpenseRow expense={mockExpense} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('calls editExpense on save', async () => {
    const user = userEvent.setup();
    vi.spyOn(actions, 'updateExpense').mockResolvedValue({} as Expense);

    render(<ExpenseRow expense={mockExpense} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(actions.updateExpense).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it('calls deleteExpense on delete', async () => {
    const user = userEvent.setup();
    vi.spyOn(actions, 'deleteExpense').mockResolvedValue(undefined);

    render(<ExpenseRow expense={mockExpense} />);

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(actions.deleteExpense).toHaveBeenCalledWith(mockExpense.id);
  });
});
