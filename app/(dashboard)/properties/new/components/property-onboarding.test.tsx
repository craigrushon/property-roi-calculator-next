import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PropertyOnboarding from 'app/(dashboard)/properties/new/components/property-onboarding';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { addPropertyWithDetails } from 'app/(dashboard)/properties/actions';

vi.mock('app/(dashboard)/properties/actions', () => ({
  addPropertyWithDetails: vi.fn()
}));

describe('PropertyOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first step (PropertyCard) initially', () => {
    render(<PropertyOnboarding />);

    expect(
      screen.getByRole('textbox', { name: /address/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /price/i })
    ).toBeInTheDocument();
  });

  it('navigates through the steps and collects data correctly', async () => {
    render(<PropertyOnboarding />);

    // Step 1: Fill in PropertyCard and proceed
    fireEvent.change(screen.getByRole('textbox', { name: /address/i }), {
      target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /price/i }), {
      target: { value: '500000' }
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Verify that IncomesCard appears
    expect(
      await screen.findByRole('spinbutton', { name: /amount/i })
    ).toBeInTheDocument();

    // Step 2: Fill in IncomesCard and proceed
    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '2000' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'monthly' }
    });
    fireEvent.click(screen.getByRole('button', { name: /add income/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Verify that ExpensesCard appears
    expect(
      await screen.findByRole('textbox', { name: /expense name/i })
    ).toBeInTheDocument();

    // Step 3: Fill in ExpensesCard
    fireEvent.change(screen.getByRole('textbox', { name: /expense name/i }), {
      target: { value: 'Utilities' }
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '150' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'monthly' }
    });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));

    // Click Submit and verify API call
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(addPropertyWithDetails).toHaveBeenCalledWith({
        address: '123 Main St',
        price: 500000,
        incomes: [{ amount: 2000, frequency: 'monthly' }],
        expenses: [{ name: 'Utilities', amount: 150, frequency: 'monthly' }]
      });
    });
    expect(addPropertyWithDetails).toHaveBeenCalledTimes(1);
  });

  it('displays a success message after successful submission', async () => {
    render(<PropertyOnboarding />);

    // Mock API response to simulate successful submission
    vi.mocked(addPropertyWithDetails).mockResolvedValueOnce({} as any);

    // Complete form and submit as in previous test
    fireEvent.change(screen.getByRole('textbox', { name: /address/i }), {
      target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /price/i }), {
      target: { value: '500000' }
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(
      await screen.findByRole('spinbutton', { name: /amount/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '2000' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'monthly' }
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(
      await screen.findByRole('textbox', { name: /expense name/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: /expense name/i }), {
      target: { value: 'Utilities' }
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '150' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'monthly' }
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check for success alert
    expect(
      await screen.findByText(/property added successfully!/i)
    ).toBeInTheDocument();
  });

  it('displays an error message when submission fails', async () => {
    render(<PropertyOnboarding />);

    vi.mocked(addPropertyWithDetails).mockRejectedValueOnce(
      new Error('Submission failed')
    );

    // Complete form as in previous tests
    fireEvent.change(screen.getByRole('textbox', { name: /address/i }), {
      target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /price/i }), {
      target: { value: '500000' }
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(
      await screen.findByRole('spinbutton', { name: /amount/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '2000' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'monthly' }
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(
      await screen.findByRole('textbox', { name: /expense name/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: /expense name/i }), {
      target: { value: 'Utilities' }
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '150' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'monthly' }
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check for error alert
    expect(
      await screen.findByText(/an error occurred while adding the property/i)
    ).toBeInTheDocument();
  });
});
