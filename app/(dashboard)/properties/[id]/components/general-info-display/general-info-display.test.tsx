import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GeneralInfoDisplay } from '.';

describe('GeneralInfoDisplay', () => {
  const mockProperty = {
    id: 1,
    address: '123 Main Street',
    price: 500000,
    imageUrl: '/test-image.jpg'
  };

  it('renders property information correctly', () => {
    render(<GeneralInfoDisplay property={mockProperty} />);

    expect(screen.getByText('General Information')).toBeInTheDocument();
    expect(screen.getByText('123 Main Street')).toBeInTheDocument();
    expect(screen.getByText('$500,000.00')).toBeInTheDocument();
    expect(screen.getByText('3 beds')).toBeInTheDocument();
    expect(screen.getByText('2 baths')).toBeInTheDocument();
    expect(screen.getByText('1,200 sqft')).toBeInTheDocument();
  });

  it('renders property image when imageUrl is provided', () => {
    render(<GeneralInfoDisplay property={mockProperty} />);

    const image = screen.getByAltText('123 Main Street');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders placeholder when no image is provided', () => {
    const propertyWithoutImage = {
      ...mockProperty,
      imageUrl: null
    };

    render(<GeneralInfoDisplay property={propertyWithoutImage} />);

    expect(screen.getByText('No image available')).toBeInTheDocument();
  });

  it('renders edit button with correct link', () => {
    render(<GeneralInfoDisplay property={mockProperty} />);

    const editButton = screen.getByRole('link', { name: /edit/i });
    expect(editButton).toHaveAttribute(
      'href',
      '/properties/1/edit?focus=general'
    );
  });

  it('formats currency correctly', () => {
    const expensiveProperty = {
      ...mockProperty,
      price: 1250000
    };

    render(<GeneralInfoDisplay property={expensiveProperty} />);

    expect(screen.getByText('$1,250,000.00')).toBeInTheDocument();
  });
});
