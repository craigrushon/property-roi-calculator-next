'use client';

import { FinancingType } from 'models/financing/types';
import { FinancingFactory } from 'models/financing/financing-factory';
import { FinancingParameters } from 'models/financing/types';

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
}

function FinancingResults({ type, propertyPrice, formData }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const parameters: FinancingParameters = {
    propertyPrice,
    downPayment: formData.downPayment,
    interestRate: formData.interestRate,
    loanTermYears: formData.loanTermYears,
    additionalFees: formData.additionalFees,
    currentBalance:
      type === FinancingType.HELOC ? formData.currentBalance : undefined
  };

  const calculator = FinancingFactory.createCalculator(type);
  const result = calculator.calculate(parameters);

  const principalAmount = propertyPrice - formData.downPayment;

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Financing Summary</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Payment */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">
            Monthly Payment
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(result.monthlyPayment)}
          </div>
        </div>

        {/* Total Interest */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-orange-600 font-medium">
            Total Interest
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {formatCurrency(result.totalInterest)}
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Total Cost</div>
          <div className="text-2xl font-bold text-green-900">
            {formatCurrency(result.totalCost)}
          </div>
        </div>

        {/* Principal Amount */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">
            Principal Amount
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {formatCurrency(principalAmount)}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="font-medium mb-3">Detailed Breakdown</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Property Price:</span>
              <span>{formatCurrency(propertyPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Down Payment:</span>
              <span>{formatCurrency(formData.downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span>Principal Amount:</span>
              <span>{formatCurrency(principalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Additional Fees:</span>
              <span>{formatCurrency(formData.additionalFees)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Interest Rate:</span>
              <span>{formData.interestRate.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Loan Term:</span>
              <span>{formData.loanTermYears} years</span>
            </div>
            {type === FinancingType.HELOC && (
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span>{formatCurrency(formData.currentBalance)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium border-t pt-1">
              <span>Total Interest:</span>
              <span>{formatCurrency(result.totalInterest)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Preview for Mortgage */}
      {type === FinancingType.MORTGAGE && result.amortizationSchedule && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium mb-3">First 12 Months Amortization</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Month</th>
                  <th className="text-right py-2">Principal</th>
                  <th className="text-right py-2">Interest</th>
                  <th className="text-right py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.amortizationSchedule.slice(0, 12).map((payment) => (
                  <tr key={payment.paymentNumber} className="border-b">
                    <td className="py-1">{payment.paymentNumber}</td>
                    <td className="text-right py-1">
                      {formatCurrency(payment.principalPayment)}
                    </td>
                    <td className="text-right py-1">
                      {formatCurrency(payment.interestPayment)}
                    </td>
                    <td className="text-right py-1">
                      {formatCurrency(payment.remainingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancingResults;
