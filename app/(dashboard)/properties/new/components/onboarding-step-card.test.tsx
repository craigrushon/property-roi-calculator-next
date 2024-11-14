import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OnboardingStepCard from './onboarding-step-card';
import { describe, it, vi, expect } from 'vitest';

describe('OnboardingStepCard', () => {
  const mockPrimaryAction = vi.fn();
  const mockSecondaryAction = vi.fn();

  it('renders title and description correctly', () => {
    render(
      <OnboardingStepCard
        title="Step 1: Test Title"
        description="This is a test description."
        primaryAction={{ label: 'Next', onClick: mockPrimaryAction }}
      >
        <div>Test Content</div>
      </OnboardingStepCard>
    );

    expect(
      screen.getByRole('heading', { name: /step 1: test title/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/this is a test description/i)).toBeInTheDocument();
    expect(screen.getByText(/test content/i)).toBeInTheDocument();
  });

  it('calls primary action when primary button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <OnboardingStepCard
        title="Step 1: Test Title"
        description="This is a test description."
        primaryAction={{ label: 'Next', onClick: mockPrimaryAction }}
      >
        <div>Test Content</div>
      </OnboardingStepCard>
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(mockPrimaryAction).toHaveBeenCalledTimes(1);
  });

  it('calls secondary action when secondary button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <OnboardingStepCard
        title="Step 1: Test Title"
        description="This is a test description."
        primaryAction={{ label: 'Next', onClick: mockPrimaryAction }}
        secondaryAction={{ label: 'Previous', onClick: mockSecondaryAction }}
      >
        <div>Test Content</div>
      </OnboardingStepCard>
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await user.click(prevButton);

    expect(mockSecondaryAction).toHaveBeenCalledTimes(1);
  });

  it('does not render the secondary button if no secondary action is provided', () => {
    render(
      <OnboardingStepCard
        title="Step 1: Test Title"
        description="This is a test description."
        primaryAction={{ label: 'Next', onClick: mockPrimaryAction }}
      >
        <div>Test Content</div>
      </OnboardingStepCard>
    );

    expect(
      screen.queryByRole('button', { name: /previous/i })
    ).not.toBeInTheDocument();
  });

  it('renders both primary and secondary buttons when both actions are provided', () => {
    render(
      <OnboardingStepCard
        title="Step 1: Test Title"
        description="This is a test description."
        primaryAction={{ label: 'Next', onClick: mockPrimaryAction }}
        secondaryAction={{ label: 'Previous', onClick: mockSecondaryAction }}
      >
        <div>Test Content</div>
      </OnboardingStepCard>
    );

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /previous/i })
    ).toBeInTheDocument();
  });
});
