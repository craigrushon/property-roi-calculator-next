'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function PropertyInfo({
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
        <div>
          <label htmlFor="address" className="block text-sm font-medium">
            Address
          </label>
          <Input
            type="text"
            id="address"
            value={propertyData.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="Enter property address"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="price" className="block text-sm font-medium">
            Price ($)
          </label>
          <Input
            type="number"
            id="price"
            value={propertyData.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="Enter property price"
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyInfo;
