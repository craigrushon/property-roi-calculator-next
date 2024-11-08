'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  propertyData: {
    id: number;
    address: string;
    price: number;
    imageUrl: string | null;
  };
}

function PropertyInfoCard({ propertyData }: Props) {
  const [newImage, setNewImage] = useState<File | null>(null);

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

        // Upload the image to the server using the API route
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'file-name': encodeURIComponent(newImage.name),
            'property-id': propertyData.id.toString()
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
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Property Information</h2>
      </CardHeader>
      <CardContent>
        <p>
          <span className="font-bold">Address:</span> {propertyData.address}
        </p>
        <p>
          <span className="font-bold">Price:</span> $
          {propertyData.price.toLocaleString()}
        </p>
        {propertyData.imageUrl && (
          <div className="mt-4">
            <p className="font-bold">Image</p>
            <Image
              alt={`Image for ${propertyData.address}`}
              className="aspect-square rounded-md object-cover"
              height={200}
              src={`${propertyData.imageUrl}`}
              width={200}
            />
          </div>
        )}
        <div className="mt-4">
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
          />
          {newImage && (
            <Button onClick={handleSaveImage} size="sm" className="mt-2">
              Save Image
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyInfoCard;
