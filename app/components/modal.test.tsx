import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ModalProvider, useModal } from './modal';
import { describe, it, vi, expect } from 'vitest';
import React, { ReactNode } from 'react';

describe('ModalProvider', () => {
  const TestComponent = () => {
    const { showModal, hideModal, isModalOpen } = useModal();

    return (
      <div>
        <button onClick={() => showModal(<p>Test Modal Content</p>)}>
          Show Modal
        </button>
        <button onClick={hideModal}>Hide Modal</button>
        {isModalOpen && <div>Modal is open</div>}
      </div>
    );
  };

  const renderWithProvider = (ui: ReactNode) =>
    render(<ModalProvider>{ui}</ModalProvider>);

  it('throws an error if useModal is used outside ModalProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useModal must be used within a ModalProvider'
    );

    consoleError.mockRestore();
  });

  it('renders children and provides modal context correctly', () => {
    renderWithProvider(<TestComponent />);

    expect(screen.getByText('Show Modal')).toBeInTheDocument();
    expect(screen.getByText('Hide Modal')).toBeInTheDocument();
  });

  it('shows the modal with the correct content when showModal is called', () => {
    renderWithProvider(<TestComponent />);

    // Open the modal and check content
    fireEvent.click(screen.getByText('Show Modal'));

    expect(screen.getByText('Modal is open')).toBeInTheDocument();
    expect(screen.getByText('Test Modal Content')).toBeInTheDocument();
  });

  it('hides the modal when hideModal is called', () => {
    renderWithProvider(<TestComponent />);

    // Open the modal
    fireEvent.click(screen.getByText('Show Modal'));
    expect(screen.getByText('Modal is open')).toBeInTheDocument();

    // Hide the modal
    fireEvent.click(screen.getByText('Hide Modal'));
    expect(screen.queryByText('Modal is open')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Modal Content')).not.toBeInTheDocument();
  });
});
