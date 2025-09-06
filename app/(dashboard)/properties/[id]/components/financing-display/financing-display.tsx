import { FinancingType, FinancingOption } from 'models/financing/types';
import { Badge } from 'components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '../empty-state';
import CashFinancingDisplay from './cash-financing-display';
import FinancingSummary from './financing-summary';

interface FinancingDisplayProps {
  propertyId: number;
  propertyPrice: number;
  currentFinancing?: FinancingOption;
}

function FinancingDisplay({
  propertyId,
  propertyPrice,
  currentFinancing
}: FinancingDisplayProps) {
  if (!currentFinancing) {
    return (
      <EmptyState
        title="Financing"
        description="No financing information has been configured for this property."
        badgeText="No financing configured"
      />
    );
  }

  const { type, parameters, result } = currentFinancing;

  // Add safety checks for required parameters
  if (!parameters || !result) {
    return (
      <EmptyState
        title="Financing"
        description="Financing data is incomplete or invalid."
        badgeText="Invalid financing data"
        badgeVariant="destructive"
      />
    );
  }

  const getFinancingTypeBadge = (type: FinancingType) => {
    const variants = {
      [FinancingType.MORTGAGE]: 'default',
      [FinancingType.HELOC]: 'secondary',
      [FinancingType.CASH]: 'outline'
    } as const;

    return (
      <Badge variant={variants[type]}>
        {type.charAt(0) + type.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Financing</span>
            {getFinancingTypeBadge(type)}
          </div>
          <Link href={`/properties/${propertyId}/edit?focus=financing`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {type === FinancingType.CASH ? (
          <CashFinancingDisplay
            propertyPrice={propertyPrice}
            financing={currentFinancing}
          />
        ) : (
          <FinancingSummary
            financing={currentFinancing}
            propertyPrice={propertyPrice}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default FinancingDisplay;
