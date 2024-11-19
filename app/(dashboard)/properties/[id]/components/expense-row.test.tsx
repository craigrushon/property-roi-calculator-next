import { render, screen, waitFor } from '@testing-library/react';
import ExpenseRow from './expense-row';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Expense } from 'models/types';
import { Frequency } from '@prisma/client';

describe('ExpenseRow', () => {
  const mockExpense: Expense = {
    id: 1,
    name: 'Utilities',
    amount: 150,
    frequency: Frequency.monthly
  };

  const mockOnDelete = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders expense details correctly', () => {
    render(
      <ExpenseRow
        expense={mockExpense}
        onDelete={mockOnDelete}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText(/name:/i).parentNode).toHaveTextContent(
      'Name: Utilities'
    );
    expect(screen.getByText(/amount:/i).parentNode).toHaveTextContent(
      'Amount: $150'
    );
    expect(screen.getByText(/frequency:/i).parentNode).toHaveTextContent(
      'Frequency: monthly'
    );
  });

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ExpenseRow
        expense={mockExpense}
        onDelete={mockOnDelete}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalledWith(mockExpense.id);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('enters edit mode and displays form fields', async () => {
    const user = userEvent.setup();

    render(
      <ExpenseRow
        expense={mockExpense}
        onDelete={mockOnDelete}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(screen.getByLabelText(/name/i)).toHaveValue('Utilities');
    expect(screen.getByLabelText(/amount/i)).toHaveValue(150);
    expect(screen.getByLabelText(/frequency/i)).toHaveValue('monthly');
  });

  it('updates the form state when inputs are changed', async () => {
    const user = userEvent.setup();

    render(
      <ExpenseRow
        expense={mockExpense}
        onDelete={mockOnDelete}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));

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

  it('submits the form and calls onSave with form data', async () => {
    const user = userEvent.setup();
    mockOnSave.mockResolvedValue(undefined); // Simulate successful save

    render(
      <ExpenseRow
        expense={mockExpense}
        onDelete={mockOnDelete}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));

    const nameInput = screen.getByLabelText(/name/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const frequencySelect = screen.getByLabelText(/frequency/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Utilities');
    await user.clear(amountInput);
    await user.type(amountInput, '200');
    await user.selectOptions(frequencySelect, 'yearly');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.any(FormData));
    });

    // Ensure form submission exits edit mode
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    expect(screen.getByText(/name:/i).parentNode).toHaveTextContent(
      'Name: Utilities'
    );
  });

  it('displays an error message when save fails', async () => {
    const user = userEvent.setup();
    mockOnSave.mockRejectedValue(new Error('Failed to save expense'));

    render(
      <ExpenseRow
        expense={mockExpense}
        onDelete={mockOnDelete}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/failed to save the expense/i)
      ).toBeInTheDocument();
    });

    // Ensure edit mode is not exited on failure
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('resets form state and exits edit mode on Cancel', async () => {
    const user = userEvent.setup();

    render(
      <ExpenseRow
        expense={mockExpense}
        onDelete={mockOnDelete}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));

    const nameInput = screen.getByLabelText(/name/i);
    const amountInput = screen.getByLabelText(/amount/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Utilities');
    await user.clear(amountInput);
    await user.type(amountInput, '200');

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    expect(screen.getByText(/name:/i).parentNode).toHaveTextContent(
      'Name: Utilities'
    );
    expect(screen.getByText(/amount:/i).parentNode).toHaveTextContent(
      'Amount: $150'
    );
  });
});
