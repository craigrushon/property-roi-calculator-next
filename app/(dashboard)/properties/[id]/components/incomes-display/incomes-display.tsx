import { Card, CardHeader, CardTitle, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { Income } from 'models/types';
import EmptyState from '../empty-state';

interface IncomesDisplayProps {
  propertyId: number;
  incomes: Income[];
}

function IncomesDisplay({ propertyId, incomes }: IncomesDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  if (incomes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Income Streams</span>
            <Link href={`/properties/${propertyId}/edit?focus=incomes`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No Income Streams"
            description="No income streams have been configured for this property."
            badgeText="No income configured"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Income Streams</span>
          <Link href={`/properties/${propertyId}/edit?focus=incomes`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {incomes.map((income, index) => (
            <div
              key={income.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm">Unit #{index + 1}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(income.amount)}{' '}
                  {formatFrequency(income.frequency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default IncomesDisplay;
