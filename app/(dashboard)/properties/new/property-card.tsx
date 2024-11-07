'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import PropertyInfoForm from '../property-form';

function PropertyCard({
  propertyData,
  onChange,
  onNext
}: {
  propertyData: { address: string; price: string };
  onChange: (updatedData: any) => void;
  onNext: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-center">
          Step 1: Property Information
        </h2>
        <p className="text-l text-center">
          Enter the property's basic information, such as the address and price.
        </p>
      </CardHeader>
      <CardContent>
        <PropertyInfoForm propertyData={propertyData} onChange={onChange} />
      </CardContent>
      <CardFooter className="justify-between border-t border-t-gray-200 pt-6">
        <Button onClick={onNext} size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyCard;
