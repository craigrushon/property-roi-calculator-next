import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  propertyId: number;
  imageUrl: string | null;
}

function PropertyImageUploader({ propertyId, imageUrl }: Props) {
  const [newImage, setNewImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
    }
  };

  const handleSaveImage = async () => {
    if (newImage) {
      try {
        const formData = new FormData();
        formData.append('file', newImage);

        const response = await fetch('/api/upload', {
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

        await response.json();
        alert('Image uploaded successfully!');
        setNewImage(null);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
      }
    }
  };

  return (
    <div className="mt-4">
      {imageUrl || newImage ? (
        <div className="flex items-center gap-4">
          <Image
            alt="Property Image"
            className="aspect-square rounded-md object-cover"
            height={200}
            src={newImage ? URL.createObjectURL(newImage) : imageUrl!}
            width={200}
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
                onClick={() => setNewImage(null)}
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
      ) : (
        <div>
          <label
            htmlFor="propertyImage"
            className="block text-sm font-medium mb-2"
          >
            Upload Property Image
          </label>
          <Input
            type="file"
            id="propertyImage"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>
      )}
      {/* Hidden file input for programmatic trigger */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
        accept="image/*"
      />
    </div>
  );
}

export default PropertyImageUploader;
