'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { logError } from '@/lib/utils';

const UPLOAD_API_URL = '/api/upload';

interface Props {
  propertyId: number;
  imageUrl: string | null;
}

function PropertyImageUploader({ propertyId, imageUrl }: Props) {
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(imageUrl);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newImageUrl = newImage ? URL.createObjectURL(newImage) : null;
  const isImageSelected = Boolean(newImageUrl || savedImageUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  };

  const handleDiscardImage = () => {
    setNewImage(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSaveImage = async () => {
    if (newImage) {
      try {
        const formData = new FormData();
        formData.append('file', newImage);

        const response = await fetch(UPLOAD_API_URL, {
          method: 'POST',
          headers: {
            'file-name': encodeURIComponent(newImage.name),
            'property-id': propertyId.toString()
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload image.');
        }

        const data = await response.json();

        setSavedImageUrl(data.filePath);
        setNewImage(null);
        setErrorMessage(null);
        setSuccessMessage('Image uploaded successfully!');
      } catch (error: Error | unknown) {
        logError(error, 'Failed to upload image');
        setErrorMessage(
          "We're unable to upload the image. Please try again later."
        );
      }
    }
  };

  // Clear the success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="mt-4">
      {isImageSelected ? (
        <div className="flex items-center gap-4">
          <Image
            alt="Property Image"
            className="aspect-square rounded-md object-cover"
            height={200}
            src={newImageUrl ? newImageUrl : savedImageUrl!}
            width={200}
            priority
            onError={() => setSavedImageUrl(null)}
          />
          {!newImage ? (
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              variant="outline"
            >
              Change Image
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleDiscardImage}
                size="sm"
                variant="secondary"
              >
                Discard
              </Button>
              <Button onClick={handleSaveImage} size="sm">
                Save Image
              </Button>
            </div>
          )}
        </div>
      ) : null}
      <label
        htmlFor="propertyImage"
        className={`${isImageSelected ? 'hidden' : ''} block text-sm font-medium mb-2`}
      >
        Upload Property Image
      </label>
      <Input
        id="propertyImage"
        type="file"
        ref={fileInputRef}
        className={`${isImageSelected && 'hidden'}`}
        onChange={handleImageChange}
        accept="image/*"
      />

      {/* Success and Error Messages */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="bg-green-100 text-green-700 p-3 mt-4 rounded-md inline-block"
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-100 text-red-700 p-4 rounded-md inline-block"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default PropertyImageUploader;
