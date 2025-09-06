import { render, screen, waitFor } from '@testing-library/react';
import PropertyImageUploader from './image-uploader';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

global.URL.createObjectURL = vi.fn(() => '/test-image.jpg');

describe('PropertyImageUploader', () => {
  const mockPropertyId = 1;
  const mockImageUrl = '/test-image.jpg';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload input if neither imageUrl nor newImage is provided', () => {
    render(
      <PropertyImageUploader propertyId={mockPropertyId} imageUrl={null} />
    );

    expect(screen.getByLabelText(/upload property image/i)).toBeInTheDocument();
  });

  it('renders existing image and change button if imageUrl is provided', () => {
    render(
      <PropertyImageUploader
        propertyId={mockPropertyId}
        imageUrl={mockImageUrl}
      />
    );

    expect(screen.getByAltText(/property image/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /change image/i })
    ).toBeInTheDocument();
  });

  it('shows discard and save buttons when a new image is selected', async () => {
    const user = userEvent.setup();

    render(
      <PropertyImageUploader
        propertyId={mockPropertyId}
        imageUrl={mockImageUrl}
      />
    );

    // Click "Change Image" to reveal the hidden file input
    await user.click(screen.getByRole('button', { name: /change image/i }));

    // Select a new image file
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png'
    });
    const fileInput = screen.getByLabelText(/upload property image/i);
    await user.upload(fileInput, file);

    expect(
      screen.getByRole('button', { name: /discard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save image/i })
    ).toBeInTheDocument();
  });

  it('discards the selected image when Discard button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <PropertyImageUploader
        propertyId={mockPropertyId}
        imageUrl={mockImageUrl}
      />
    );

    // Click "Change Image" to reveal the hidden file input
    await user.click(screen.getByRole('button', { name: /change image/i }));

    // Select a new image file
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png'
    });
    const fileInput = screen.getByLabelText(/upload property image/i);
    await user.upload(fileInput, file);

    // Click "Discard" and verify that "Discard" and "Save" buttons are hidden again
    await user.click(screen.getByRole('button', { name: /discard/i }));
    expect(
      screen.queryByRole('button', { name: /discard/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /save image/i })
    ).not.toBeInTheDocument();
  });

  it('uploads the selected image when Save button is clicked', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    } as Response);

    render(
      <PropertyImageUploader
        propertyId={mockPropertyId}
        imageUrl={mockImageUrl}
      />
    );

    // Click "Change Image" to reveal the hidden file input
    await user.click(screen.getByRole('button', { name: /change image/i }));

    // Select a new image file
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png'
    });
    const fileInput = screen.getByLabelText(/upload property image/i);
    await user.upload(fileInput, file);

    // Click "Save Image" and verify the API call
    await user.click(screen.getByRole('button', { name: /save image/i }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/upload',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'file-name': encodeURIComponent(file.name),
            'property-id': mockPropertyId.toString()
          }),
          body: expect.any(FormData)
        })
      );
    });

    mockFetch.mockRestore();
  });

  it('displays a success message if the image upload succeeds', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ filePath: '/uploads/test-image.png' })
    } as Response);

    render(
      <PropertyImageUploader
        propertyId={mockPropertyId}
        imageUrl={mockImageUrl}
      />
    );

    // Click "Change Image" to reveal the hidden file input
    await user.click(screen.getByRole('button', { name: /change image/i }));

    // Select a new image file
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png'
    });
    const fileInput = screen.getByLabelText(/upload property image/i);
    await user.upload(fileInput, file);

    // Click "Save Image" and check for success message
    await user.click(screen.getByRole('button', { name: /save image/i }));
    expect(
      await screen.findByText(/image uploaded successfully/i)
    ).toBeInTheDocument();

    // Ensure fetch was called only once
    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });

  it('displays an error message if the image upload fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false
    } as Response);

    render(
      <PropertyImageUploader
        propertyId={mockPropertyId}
        imageUrl={mockImageUrl}
      />
    );

    // Click "Change Image" to reveal the hidden file input
    await user.click(screen.getByRole('button', { name: /change image/i }));

    // Select a new image file
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png'
    });
    const fileInput = screen.getByLabelText(/upload property image/i);
    await user.upload(fileInput, file);

    // Click "Save Image" and wait for error message
    await user.click(screen.getByRole('button', { name: /save image/i }));
    expect(
      await screen.findByText(/we're unable to upload the image/i)
    ).toBeInTheDocument();
  });
});
