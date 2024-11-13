import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from 'app/(dashboard)/properties/new/components/property-card';
import { describe, it, vi, expect, beforeEach } from 'vitest';

describe('PropertyCard', () => {
  const mockOnChange = vi.fn();
  const mockOnNext = vi.fn();
  const initialPropertyData = { address: '', price: '' };

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnNext.mockClear();
  });

  it('renders PropertyInfoForm and displays the correct step information', () => {
    render(
      <PropertyCard
        propertyData={initialPropertyData}
        onChange={mockOnChange}
        onNext={mockOnNext}
      />
    );

    expect(
      screen.getByText(/step 1: property information/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /enter the property's basic information, such as the address and price/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: /address/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /price/i })
    ).toBeInTheDocument();
  });

  it('calls onChange with updated address when address input changes', () => {
    render(
      <PropertyCard
        propertyData={initialPropertyData}
        onChange={mockOnChange}
        onNext={mockOnNext}
      />
    );

    const addressInput = screen.getByRole('textbox', { name: /address/i });
    fireEvent.change(addressInput, { target: { value: '456 Elm St' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({ address: '456 Elm St' });
  });

  it('calls onChange with updated price when price input changes', () => {
    render(
      <PropertyCard
        propertyData={initialPropertyData}
        onChange={mockOnChange}
        onNext={mockOnNext}
      />
    );

    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    fireEvent.change(priceInput, { target: { value: '250000' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({ price: '250000' });
  });

  it('calls onNext when Next button is clicked', () => {
    render(
      <PropertyCard
        propertyData={initialPropertyData}
        onChange={mockOnChange}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});
