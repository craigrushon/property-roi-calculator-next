import { FinancingType, FinancingOption } from 'models/financing/types';
import { Badge } from 'components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import EmptyState from '../empty-state';
import CashFinancingDisplay from './cash-financing-display';
import LoanFinancingDisplay from './loan-financing-display';

interface FinancingDisplayProps {
  propertyPrice: number;
  currentFinancing?: FinancingOption;
}

function FinancingDisplay({
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
          Financing
          {getFinancingTypeBadge(type)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {type === FinancingType.CASH ? (
          <CashFinancingDisplay
            propertyPrice={propertyPrice}
            financing={currentFinancing}
          />
        ) : (
          <LoanFinancingDisplay
            propertyPrice={propertyPrice}
            financing={currentFinancing}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default FinancingDisplay;
