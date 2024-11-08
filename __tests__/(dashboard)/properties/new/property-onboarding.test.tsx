import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPropertyOnboarding from 'app/(dashboard)/properties/new/property-onboarding';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { addPropertyWithDetails } from 'app/(dashboard)/properties/actions';

vi.mock('app/(dashboard)/properties/actions', () => ({
  addPropertyWithDetails: vi.fn()
}));

describe('AddPropertyOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first step (PropertyCard) initially', () => {
    render(<AddPropertyOnboarding />);

    expect(
      screen.getByRole('textbox', { name: /address/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /price/i })
    ).toBeInTheDocument();
  });

  it('navigates through the steps and collects data correctly', async () => {
    render(<AddPropertyOnboarding />);

    // Step 1: Fill in PropertyCard and proceed
    fireEvent.change(screen.getByRole('textbox', { name: /address/i }), {
      target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /price/i }), {
      target: { value: '500000' }
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Verify that IncomesCard appears
    await waitFor(() =>
      expect(
        screen.getByRole('spinbutton', { name: /amount/i })
      ).toBeInTheDocument()
    );

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
    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: /expense name/i })
      ).toBeInTheDocument()
    );

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
      expect(addPropertyWithDetails).toHaveBeenCalledTimes(1);
      expect(addPropertyWithDetails).toHaveBeenCalledWith({
        address: '123 Main St',
        price: 500000,
        incomes: [{ amount: 2000, frequency: 'monthly' }],
        expenses: [{ name: 'Utilities', amount: 150, frequency: 'monthly' }]
      });
    });
  });

  it('displays a success message after successful submission', async () => {
    render(<AddPropertyOnboarding />);

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
    await waitFor(() =>
      expect(
        screen.getByRole('spinbutton', { name: /amount/i })
      ).toBeInTheDocument()
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '2000' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'monthly' }
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: /expense name/i })
      ).toBeInTheDocument()
    );

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
    await waitFor(() =>
      expect(
        screen.getByText(/property added successfully!/i)
      ).toBeInTheDocument()
    );
  });

  it('displays an error message when submission fails', async () => {
    render(<AddPropertyOnboarding />);

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
    await waitFor(() =>
      expect(
        screen.getByRole('spinbutton', { name: /amount/i })
      ).toBeInTheDocument()
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '2000' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /frequency/i }), {
      target: { value: 'monthly' }
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: /expense name/i })
      ).toBeInTheDocument()
    );

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
    await waitFor(() =>
      expect(
        screen.getByText(/an error occurred while adding the property/i)
      ).toBeInTheDocument()
    );
  });
});
