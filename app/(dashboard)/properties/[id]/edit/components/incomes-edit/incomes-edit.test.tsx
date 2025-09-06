import { render, screen, waitFor } from '@testing-library/react';
import IncomesEdit from './incomes-edit';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import * as actions from '../../actions';
import { Income } from 'models/types';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' })
}));

describe('IncomesEdit', () => {
  const mockIncomes: Income[] = [
    { id: 1, amount: 2000, frequency: 'monthly' },
    { id: 2, amount: 24000, frequency: 'yearly' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the incomes list', () => {
    render(<IncomesEdit incomes={mockIncomes} />);

    expect(screen.getByText(/\$2,000/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
    expect(screen.getByText(/\$24,000/i)).toBeInTheDocument();
    expect(screen.getByText(/yearly/i)).toBeInTheDocument();
  });

  it('displays the add income form when "Add Income" is clicked', async () => {
    const user = userEvent.setup();

    render(<IncomesEdit incomes={mockIncomes} />);

    await user.click(screen.getByRole('button', { name: /add income/i }));

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
  });

  it('calls createIncome on form submission', async () => {
    const user = userEvent.setup();
    vi.spyOn(actions, 'createIncome').mockResolvedValue({} as Income);

    render(<IncomesEdit incomes={mockIncomes} />);

    await user.click(screen.getByRole('button', { name: /add income/i }));

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/amount/i), '5000');
    await user.selectOptions(screen.getByLabelText(/frequency/i), 'monthly');

    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(actions.createIncome).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it('hides the add income form on cancel', async () => {
    const user = userEvent.setup();

    render(<IncomesEdit incomes={mockIncomes} />);

    await user.click(screen.getByRole('button', { name: /add income/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByLabelText(/amount/i)).not.toBeInTheDocument();
  });
});
