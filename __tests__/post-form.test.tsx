import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostForm } from 'components/post-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('PostForm', () => {
  const mockUser = { id: 1, name: 'John Doe' };
  const mockSubmit = vi.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders the form with textarea and submit button', () => {
    render(<PostForm onSubmit={mockSubmit} user={mockUser} />);

    const textarea = screen.getByRole('textbox', { name: /post content/i });
    expect(textarea).toHaveValue('');
    expect(textarea).toHaveAttribute(
      'placeholder',
      "What's on your mind today?"
    );

    const submitButton = screen.getByRole('button', { name: /Post it!/i });
    expect(submitButton).toBeInTheDocument();

    const heading = screen.getByRole('heading', {
      name: /Currently posting as John Doe/i
    });
    expect(heading).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    mockSubmit.mockResolvedValueOnce({ post: {} });
    render(<PostForm onSubmit={mockSubmit} user={mockUser} />);

    const textarea = screen.getByRole('textbox', { name: /post content/i });
    const submitButton = screen.getByRole('button', { name: /post it!/i });

    fireEvent.change(textarea, { target: { value: 'This is a test post' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmit).toHaveBeenCalledTimes(1));
    expect(mockSubmit).toHaveBeenCalledWith(expect.any(FormData));

    expect(await screen.findByRole('status')).toHaveTextContent(
      /post created successfully/i
    );
  });

  it('shows an error message when submission fails', async () => {
    mockSubmit.mockResolvedValueOnce({ error: 'Something went wrong' });
    render(<PostForm onSubmit={mockSubmit} user={mockUser} />);

    const textarea = screen.getByRole('textbox', { name: /post content/i });
    const submitButton = screen.getByRole('button', { name: /post it!/i });

    fireEvent.change(textarea, { target: { value: 'This is a test post' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmit).toHaveBeenCalledTimes(1));
    expect(mockSubmit).toHaveBeenCalledWith(expect.any(FormData));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /something went wrong/i
    );
    expect(textarea).toHaveAttribute('aria-describedby', 'error-message');
  });

  it('displays anonymous user when no user is provided', () => {
    render(<PostForm onSubmit={mockSubmit} user={null} />);

    expect(
      screen.getByRole('heading', { name: /currently posting as anonymous/i })
    ).toBeInTheDocument();
  });

  it('disables the submit button while submitting', async () => {
    mockSubmit.mockResolvedValueOnce({ post: {} });

    render(<PostForm onSubmit={mockSubmit} user={mockUser} />);
    const submitButton = screen.getByRole('button', { name: /post it!/i });
    const textarea = screen.getByRole('textbox', { name: /post content/i });

    fireEvent.change(textarea, { target: { value: 'This is a test post' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());
    await waitFor(() => expect(mockSubmit).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
});
