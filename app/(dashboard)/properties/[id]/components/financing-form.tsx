'use client';

import { FinancingType } from 'models/financing/types';

interface Props {
  type: FinancingType;
  propertyPrice: number;
  formData: {
    downPayment: number;
    interestRate: number;
    loanTermYears: number;
    additionalFees: number;
    currentBalance: number;
  };
  onFormChange: (field: string, value: number) => void;
  disabled?: boolean;
}

function FinancingForm({ type, propertyPrice, formData, onFormChange, disabled = false }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const downPaymentPercentage = propertyPrice > 0 ? (formData.downPayment / propertyPrice) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Down Payment */}
        {(type === FinancingType.MORTGAGE || type === FinancingType.HELOC) && (
          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium mb-1">
              Down Payment
            </label>
            <div className="relative">
              <input
                id="downPayment"
                type="number"
                value={formData.downPayment}
                onChange={(e) => onFormChange('downPayment', Number(e.target.value))}
                disabled={disabled}
                className="w-full border p-2 pr-20 text-sm"
                min="0"
                step="1000"
              />
              <div className="absolute right-2 top-2 text-xs text-gray-500">
                {formatPercentage(downPaymentPercentage)}
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Property Price: {formatCurrency(propertyPrice)}
            </div>
          </div>
        )}

        {/* Interest Rate */}
        {(type === FinancingType.MORTGAGE || type === FinancingType.HELOC) && (
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium mb-1">
              Interest Rate
            </label>
            <div className="relative">
              <input
                id="interestRate"
                type="number"
                value={formData.interestRate}
                onChange={(e) => onFormChange('interestRate', Number(e.target.value))}
                disabled={disabled}
                className="w-full border p-2 pr-12 text-sm"
                min="0"
                max="30"
                step="0.01"
              />
              <div className="absolute right-2 top-2 text-xs text-gray-500">
                %
              </div>
            </div>
          </div>
        )}

        {/* Loan Term */}
        {(type === FinancingType.MORTGAGE || type === FinancingType.HELOC) && (
          <div>
            <label htmlFor="loanTermYears" className="block text-sm font-medium mb-1">
              Loan Term
            </label>
            <select
              id="loanTermYears"
              value={formData.loanTermYears}
              onChange={(e) => onFormChange('loanTermYears', Number(e.target.value))}
              disabled={disabled}
              className="w-full border p-2 text-sm"
            >
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={25}>25 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>
        )}

        {/* Current Balance (HELOC only) */}
        {type === FinancingType.HELOC && (
          <div>
            <label htmlFor="currentBalance" className="block text-sm font-medium mb-1">
              Current Balance
            </label>
            <input
              id="currentBalance"
              type="number"
              value={formData.currentBalance}
              onChange={(e) => onFormChange('currentBalance', Number(e.target.value))}
              disabled={disabled}
              className="w-full border p-2 text-sm"
              min="0"
              step="1000"
            />
            <div className="text-xs text-gray-600 mt-1">
              Current outstanding balance on HELOC
            </div>
          </div>
        )}

        {/* Additional Fees */}
        <div>
          <label htmlFor="additionalFees" className="block text-sm font-medium mb-1">
            Additional Fees
          </label>
          <input
            id="additionalFees"
            type="number"
            value={formData.additionalFees}
            onChange={(e) => onFormChange('additionalFees', Number(e.target.value))}
            disabled={disabled}
            className="w-full border p-2 text-sm"
            min="0"
            step="100"
          />
          <div className="text-xs text-gray-600 mt-1">
            Closing costs, origination fees, etc.
          </div>
        </div>
      </div>

      {/* Summary for Cash Purchase */}
      {type === FinancingType.CASH && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Cash Purchase Summary</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Property Price:</span>
              <span>{formatCurrency(propertyPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Additional Fees:</span>
              <span>{formatCurrency(formData.additionalFees)}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-1">
              <span>Total Cost:</span>
              <span>{formatCurrency(propertyPrice + formData.additionalFees)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancingForm;
