import { Input } from '@/components/ui/input';
import PropertyFormFields from 'app/(dashboard)/components/property-fields';
import { useState } from 'react';

interface PropertyData {
  address: string;
  price: string;
}

function ControlledPropertyFields({
  propertyData
}: {
  propertyData?: Partial<PropertyData>;
}) {
  const [property, setProperty] = useState<PropertyData>({
    address: propertyData?.address || '',
    price: propertyData?.price || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedData = { ...property, [id]: value };
    setProperty(updatedData);
  };

  return (
    <PropertyFormFields
      address={property.address}
      price={property.price}
      onChange={handleChange}
    />
  );
}

export default ControlledPropertyFields;
