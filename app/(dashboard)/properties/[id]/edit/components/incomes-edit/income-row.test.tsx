import { render, screen, waitFor } from '@testing-library/react';
import IncomeRow from './income-row';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Income } from 'models/types';
import * as actions from '../../actions';

describe('IncomeRow', () => {
  const mockIncome: Income = {
    id: 1,
    amount: 2000,
    frequency: 'monthly'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders income details', () => {
    render(<IncomeRow income={mockIncome} unitIdentifier="1" />);

    expect(screen.getByText(/\$2,000/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
  });

  it('toggles to edit mode when Edit is clicked', async () => {
    const user = userEvent.setup();

    render(<IncomeRow income={mockIncome} unitIdentifier="1" />);

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
  });

  it('calls updateIncome on save', async () => {
    const user = userEvent.setup();
    vi.spyOn(actions, 'updateIncome').mockResolvedValue({} as Income);

    render(<IncomeRow income={mockIncome} unitIdentifier="1" />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(actions.updateIncome).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it('calls deleteIncome handler on Delete click', async () => {
    const user = userEvent.setup();
    vi.spyOn(actions, 'deleteIncome').mockResolvedValue(undefined);

    render(<IncomeRow income={mockIncome} unitIdentifier="1" />);

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(actions.deleteIncome).toHaveBeenCalledWith(mockIncome.id);
  });
});
