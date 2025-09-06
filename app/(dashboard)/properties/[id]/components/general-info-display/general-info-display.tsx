import { Card, CardHeader, CardTitle, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';

interface GeneralInfoDisplayProps {
  property: {
    id: number;
    address: string;
    price: number;
    imageUrl: string | null;
  };
}

function GeneralInfoDisplay({ property }: GeneralInfoDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>General Information</span>
          <Link href={`/properties/${property.id}/edit?focus=general`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left side - Property Image */}
          <div className="flex justify-center lg:justify-start">
            {property.imageUrl ? (
              <img
                src={property.imageUrl}
                alt={property.address}
                className="w-full max-w-sm aspect-square object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full max-w-sm aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          {/* Right side - Property Details */}
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(property.price)}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">{property.address}</p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>3 beds</span>
              <span>2 baths</span>
              <span>1,200 sqft</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default GeneralInfoDisplay;
