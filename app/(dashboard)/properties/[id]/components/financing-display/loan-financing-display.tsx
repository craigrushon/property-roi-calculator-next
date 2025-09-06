import { FinancingOption, FinancingType } from 'models/financing/types';
import { formatCurrency, formatPercentage } from 'lib/utils';

interface LoanFinancingDisplayProps {
  propertyPrice: number;
  financing: FinancingOption;
}

function LoanFinancingDisplay({
  propertyPrice,
  financing
}: LoanFinancingDisplayProps) {
  const { type, parameters, result } = financing;

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
            Down Payment
          </label>
          <p className="text-lg font-semibold">
            {formatCurrency(parameters.downPayment)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Interest Rate
          </label>
          <p className="text-lg font-semibold">
            {formatPercentage(parameters.interestRate)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Loan Term
          </label>
          <p className="text-lg font-semibold">
            {parameters.loanTermYears
              ? `${parameters.loanTermYears} years`
              : 'N/A'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Monthly Payment
          </label>
          <p className="text-lg font-semibold">
            {formatCurrency(result.monthlyPayment)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Total Interest
          </label>
          <p className="text-lg font-semibold">
            {formatCurrency(result.totalInterest)}
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
        {type === FinancingType.HELOC && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Current Balance
            </label>
            <p className="text-lg font-semibold">
              {formatCurrency(parameters.currentBalance || 0)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanFinancingDisplay;
