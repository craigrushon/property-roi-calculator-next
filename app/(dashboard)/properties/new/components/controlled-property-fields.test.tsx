import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyForm from './controlled-property-fields';
import { describe, it, expect } from 'vitest';

describe('ControlledPropertyFields', () => {
  it('renders address and price input fields', () => {
    render(<PropertyForm />);

    const addressInput = screen.getByRole('textbox', { name: /address/i });
    expect(addressInput).toBeInTheDocument();

    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    expect(priceInput).toBeInTheDocument();
  });

  it('renders address and price input fields with empty values if no initial data is provided', () => {
    render(<PropertyForm />);

    const addressInput = screen.getByRole('textbox', { name: /address/i });
    expect(addressInput).toHaveValue('');

    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    expect(priceInput).toHaveValue(null);
  });

  it('updates the address input value when user types', async () => {
    const user = userEvent.setup();
    render(<PropertyForm />);

    const addressInput = screen.getByRole('textbox', { name: /address/i });
    await user.type(addressInput, '456 Elm St');

    await waitFor(() => expect(addressInput).toHaveValue('456 Elm St'));
  });

  it('updates the price input value when user types', async () => {
    const user = userEvent.setup();
    render(<PropertyForm />);

    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    await user.type(priceInput, '250000');

    await waitFor(() => expect(priceInput).toHaveValue(250000));
  });
});
