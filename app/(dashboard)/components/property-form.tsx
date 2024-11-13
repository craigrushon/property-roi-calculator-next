import { Input } from '@/components/ui/input';

interface PropertyData {
  address: string;
  price: string;
}

function PropertyForm({
  propertyData,
  onChange
}: {
  propertyData: { address: string; price: string };
  onChange: (updatedData: Partial<PropertyData>) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.id]: e.target.value });
  };

  return (
    <div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium">
          Address
        </label>
        <Input
          type="text"
          id="address"
          value={propertyData.address}
          onChange={handleChange}
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
          onChange={handleChange}
          placeholder="Enter property price"
          required
        />
      </div>
    </div>
  );
}

export default PropertyForm;
