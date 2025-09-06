import { render, screen, waitFor } from '@testing-library/react';
import ExpensesEdit from './expenses-edit';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import * as actions from '../../actions';
import { Expense } from 'models/types';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' })
}));

describe('ExpensesEdit', () => {
  const mockExpenses: Expense[] = [
    { id: 1, name: 'Utilities', amount: 150, frequency: 'monthly' },
    { id: 2, name: 'Insurance', amount: 100, frequency: 'yearly' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders expenses list', () => {
    render(<ExpensesEdit expenses={mockExpenses} />);

    expect(screen.getByText(/utilities/i)).toBeInTheDocument();
    expect(screen.getByText(/insurance/i)).toBeInTheDocument();
  });

  it('displays add expense form when Add Expense is clicked', async () => {
    const user = userEvent.setup();

    render(<ExpensesEdit expenses={mockExpenses} />);

    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('calls createExpense on form submission', async () => {
    const user = userEvent.setup();
    vi.spyOn(actions, 'createExpense').mockResolvedValue({} as Expense);

    render(<ExpensesEdit expenses={mockExpenses} />);

    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(actions.createExpense).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it('hides add expense form on cancel', async () => {
    const user = userEvent.setup();

    render(<ExpensesEdit expenses={mockExpenses} />);

    await user.click(screen.getByRole('button', { name: /add expense/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });
});
