import { render, screen, waitFor } from '@testing-library/react';
import ExpenseForm from './expense-form';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('ExpenseForm', () => {
  const mockPrimaryAction = {
    label: 'Save',
    action: vi.fn()
  };

  const mockOnCancel = vi.fn();

  const initialData = {
    name: 'Utilities',
    amount: 150,
    frequency: 'monthly'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields with initial values', () => {
    render(
      <ExpenseForm
        initialData={initialData}
        onCancel={mockOnCancel}
        primaryAction={mockPrimaryAction}
      />
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('Utilities');
    expect(screen.getByLabelText(/amount/i)).toHaveValue(150);
    expect(screen.getByLabelText(/frequency/i)).toHaveValue('monthly');
  });

  it('updates form state when inputs are changed', async () => {
    const user = userEvent.setup();

    render(
      <ExpenseForm
        initialData={initialData}
        onCancel={mockOnCancel}
        primaryAction={mockPrimaryAction}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const frequencySelect = screen.getByLabelText(/frequency/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Utilities');
    await user.clear(amountInput);
    await user.type(amountInput, '200');
    await user.selectOptions(frequencySelect, 'yearly');

    expect(nameInput).toHaveValue('Updated Utilities');
    expect(amountInput).toHaveValue(200);
    expect(frequencySelect).toHaveValue('yearly');
  });

  it('submits the form and calls primaryAction', async () => {
    const user = userEvent.setup();
    mockPrimaryAction.action.mockResolvedValue(undefined);

    render(
      <ExpenseForm
        initialData={initialData}
        onCancel={mockOnCancel}
        primaryAction={mockPrimaryAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockPrimaryAction.action).toHaveBeenCalledWith(
        expect.any(FormData)
      );
    });
  });

  it('displays error message on submission failure', async () => {
    const user = userEvent.setup();
    mockPrimaryAction.action.mockRejectedValue(
      new Error('Failed to save expense')
    );

    render(
      <ExpenseForm
        initialData={initialData}
        onCancel={mockOnCancel}
        primaryAction={mockPrimaryAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to save expense/i)).toBeInTheDocument();
    });
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ExpenseForm
        initialData={initialData}
        onCancel={mockOnCancel}
        primaryAction={mockPrimaryAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
