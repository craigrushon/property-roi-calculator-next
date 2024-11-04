'use client';
import { Input } from '@/components/ui/input';

function PropertyInfo({
  propertyData,
  onChange
}: {
  propertyData: { address: string; price: string };
  onChange: (updatedData: any) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 1: Property Information</h2>
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
    </div>
  );
}

export default PropertyInfo;
