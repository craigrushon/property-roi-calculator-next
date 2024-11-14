import { Input } from '@/components/ui/input';

export interface PropertyFormFieldsProps {
  address: string;
  price: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PropertyFormFields({
  address,
  price,
  onChange
}: PropertyFormFieldsProps) {
  return (
    <div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium">
          Address
        </label>
        <Input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={onChange}
          placeholder="Enter property address"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="price" className="block text-sm font-medium">
          Price ($)
        </label>
        <Input
          type="number"
          id="price"
          name="price"
          value={price}
          onChange={onChange}
          placeholder="Enter property price"
        />
      </div>
    </div>
  );
}

export default PropertyFormFields;
