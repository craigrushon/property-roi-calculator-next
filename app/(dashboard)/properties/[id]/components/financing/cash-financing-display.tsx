import { FinancingOption } from 'models/financing/types';

interface CashFinancingDisplayProps {
  propertyPrice: number;
  financing: FinancingOption;
}

function CashFinancingDisplay({
  propertyPrice,
  financing
}: CashFinancingDisplayProps) {
  const { parameters, result } = financing;

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Property Price
          </label>
          <p className="text-lg font-semibold">
            {formatCurrency(propertyPrice)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Additional Fees
          </label>
          <p className="text-lg font-semibold">
            {formatCurrency(parameters.additionalFees || 0)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Total Cost
          </label>
          <p className="text-lg font-semibold">
            {formatCurrency(result.totalCost)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CashFinancingDisplay;
