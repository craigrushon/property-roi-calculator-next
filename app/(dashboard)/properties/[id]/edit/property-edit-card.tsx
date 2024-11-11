'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PropertyForm from '../../property-form';
import { updateProperty } from '../../actions';
import PropertyImageUploader from './property-image-uploader';

interface Props {
  currentData: {
    id: number;
    address: string;
    price: string;
    imageUrl: string | null;
  };
}

function PropertyEditCard({ currentData }: Props) {
  const [propertyData, setPropertyData] =
    useState<Props['currentData']>(currentData);
  const [originalData, setOriginalData] = useState(currentData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasAddressOrPriceChanges, setHasAddressOrPriceChanges] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check for changes in address or price only
    setHasAddressOrPriceChanges(
      propertyData.address !== originalData.address ||
        propertyData.price !== originalData.price
    );
  }, [propertyData, originalData]);

  const handlePropertyInfoChange = (
    updatedData: Partial<{ address: string; price: string }>
  ) => {
    setPropertyData((prevData) => ({
      ...prevData,
      ...updatedData
    }));
  };

  const handleSaveProperty = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateProperty(propertyData.id, {
        address: propertyData.address,
        price: propertyData.price
      });
      setOriginalData((prevData) => ({
        ...prevData,
        address: propertyData.address,
        price: propertyData.price
      }));
      setSuccessMessage('Property updated successfully!');
    } catch (error) {
      console.error('Error saving property:', error);
      setErrorMessage('Failed to save property. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Property Information</h2>
      </CardHeader>
      <CardContent>
        <PropertyForm
          propertyData={propertyData}
          onChange={handlePropertyInfoChange}
        />
        <PropertyImageUploader
          propertyId={propertyData.id}
          imageUrl={propertyData.imageUrl}
        />

        {/* Success and Error Messages */}
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="bg-green-100 text-green-700 p-3 mt-4 rounded-md"
          >
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="bg-red-100 text-red-700 p-4 rounded-md"
          >
            {errorMessage}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          {hasAddressOrPriceChanges && (
            <Button
              size="sm"
              onClick={() => setPropertyData(originalData)}
              variant="secondary"
            >
              Reset
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSaveProperty}
            disabled={isSaving || !hasAddressOrPriceChanges}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PropertyEditCard;
