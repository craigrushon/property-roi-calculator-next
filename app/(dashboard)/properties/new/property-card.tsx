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
        <h2 className="text-xl font-bold">Step 1: Property Information</h2>
      </CardHeader>
      <CardContent>
        <PropertyInfoForm propertyData={propertyData} onChange={onChange} />
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyCard;
