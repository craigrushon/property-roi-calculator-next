import { render, screen, fireEvent } from '@testing-library/react';
import PropertyForm from 'app/(dashboard)/properties/property-form';
import { beforeEach, describe, it, vi, expect } from 'vitest';

describe('PropertyForm', () => {
  const mockOnChange = vi.fn();
  const initialPropertyData = { address: '', price: '' };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders address and price input fields with labels', () => {
    render(
      <PropertyForm
        propertyData={initialPropertyData}
        onChange={mockOnChange}
      />
    );

    const addressInput = screen.getByRole('textbox', { name: /address/i });
    expect(addressInput).toBeInTheDocument();
    expect(addressInput).toHaveAttribute(
      'placeholder',
      'Enter property address'
    );

    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    expect(priceInput).toBeInTheDocument();
    expect(priceInput).toHaveAttribute('placeholder', 'Enter property price');
  });

  it('calls onChange with updated address when address input changes', () => {
    render(
      <PropertyForm
        propertyData={initialPropertyData}
        onChange={mockOnChange}
      />
    );

    const addressInput = screen.getByRole('textbox', { name: /address/i });
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({ address: '123 Main St' });
  });

  it('calls onChange with updated price when price input changes', () => {
    render(
      <PropertyForm
        propertyData={initialPropertyData}
        onChange={mockOnChange}
      />
    );

    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    fireEvent.change(priceInput, { target: { value: '500000' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({ price: '500000' });
  });

  it('displays initial property data in inputs', () => {
    const populatedPropertyData = { address: '456 Elm St', price: '250000' };
    render(
      <PropertyForm
        propertyData={populatedPropertyData}
        onChange={mockOnChange}
      />
    );

    const addressInput = screen.getByRole('textbox', { name: /address/i });
    expect(addressInput).toHaveValue('456 Elm St');

    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    expect(priceInput).toHaveValue(250000);
  });
});
