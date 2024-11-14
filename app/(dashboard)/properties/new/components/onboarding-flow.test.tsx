import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OnboardingFlow from './onboarding-flow';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { addPropertyWithDetails } from 'app/(dashboard)/properties/actions';

vi.mock('app/(dashboard)/properties/actions', () => ({
  addPropertyWithDetails: vi.fn()
}));

describe('PropertyOnboardingFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first step (PropertyForm) initially', () => {
    render(<OnboardingFlow />);

    expect(
      screen.getByRole('textbox', { name: /address/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /price/i })
    ).toBeInTheDocument();
  });

  it('navigates through steps and collects form data correctly', async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow />);

    // Step 1: Fill in PropertyForm and proceed
    await user.type(
      screen.getByRole('textbox', { name: /address/i }),
      '123 Main St'
    );
    await user.type(
      screen.getByRole('spinbutton', { name: /price/i }),
      '500000'
    );
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Verify IncomeForm appears
    expect(
      await screen.findByRole('spinbutton', { name: /amount/i })
    ).toBeInTheDocument();

    // Step 2: Fill in IncomeForm and proceed
    await user.type(
      screen.getByRole('spinbutton', { name: /amount/i }),
      '2000'
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: /frequency/i }),
      'monthly'
    );
    await user.click(screen.getByRole('button', { name: /add income/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Verify ExpenseForm appears
    expect(
      await screen.findByRole('textbox', { name: /expense name/i })
    ).toBeInTheDocument();

    // Step 3: Fill in ExpenseForm and submit
    await user.type(
      screen.getByRole('textbox', { name: /expense name/i }),
      'Utilities'
    );
    await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '150');
    await user.selectOptions(
      screen.getByRole('combobox', { name: /frequency/i }),
      'monthly'
    );
    await user.click(screen.getByRole('button', { name: /add expense/i }));
    await user.click(screen.getByRole('button', { name: /create property/i }));

    // Verify addPropertyWithDetails is called with correct data
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
    vi.mocked(addPropertyWithDetails).mockResolvedValueOnce({} as any);

    const user = userEvent.setup();
    render(<OnboardingFlow />);

    // Complete steps
    await user.type(
      screen.getByRole('textbox', { name: /address/i }),
      '123 Main St'
    );
    await user.type(
      screen.getByRole('spinbutton', { name: /price/i }),
      '500000'
    );
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.type(
      screen.getByRole('spinbutton', { name: /amount/i }),
      '2000'
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: /frequency/i }),
      'monthly'
    );
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.type(
      screen.getByRole('textbox', { name: /expense name/i }),
      'Utilities'
    );
    await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '150');
    await user.selectOptions(
      screen.getByRole('combobox', { name: /frequency/i }),
      'monthly'
    );
    await user.click(screen.getByRole('button', { name: /create property/i }));

    // Verify success message
    expect(
      await screen.findByText(/property added successfully!/i)
    ).toBeInTheDocument();
  });

  it('displays an error message when submission fails', async () => {
    vi.mocked(addPropertyWithDetails).mockRejectedValueOnce(
      new Error('Submission failed')
    );

    const user = userEvent.setup();
    render(<OnboardingFlow />);

    // Complete steps
    await user.type(
      screen.getByRole('textbox', { name: /address/i }),
      '123 Main St'
    );
    await user.type(
      screen.getByRole('spinbutton', { name: /price/i }),
      '500000'
    );
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.type(
      screen.getByRole('spinbutton', { name: /amount/i }),
      '2000'
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: /frequency/i }),
      'monthly'
    );
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.type(
      screen.getByRole('textbox', { name: /expense name/i }),
      'Utilities'
    );
    await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '150');
    await user.selectOptions(
      screen.getByRole('combobox', { name: /frequency/i }),
      'monthly'
    );
    await user.click(screen.getByRole('button', { name: /create property/i }));

    // Verify error message
    expect(
      await screen.findByText(/an error occurred while adding the property/i)
    ).toBeInTheDocument();
  });
});
