'use client';

import { useState } from 'react';
import { FinancingOption, FinancingType } from 'models/financing/types';
import { formatCurrency } from 'lib/utils';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { Button } from 'components/ui/button';

interface FinancingSummaryProps {
  financing: FinancingOption;
  propertyPrice: number;
}

function FinancingSummary({ financing, propertyPrice }: FinancingSummaryProps) {
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { type, parameters, result } = financing;

  const principalAmount = propertyPrice - parameters.downPayment;

  // Pagination logic for amortization schedule
  const itemsPerPage = 12;
  const totalPayments = result.amortizationSchedule?.length || 0;
  const totalPages = Math.ceil(totalPayments / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments =
    result.amortizationSchedule?.slice(startIndex, endIndex) || [];

  return (
    <div className="space-y-4">
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
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 font-medium">
            Total Interest
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(result.totalInterest)}
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 font-medium">Total Cost</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(result.totalCost)}
          </div>
        </div>

        {/* Principal Amount */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 font-medium">
            Principal Amount
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(principalAmount)}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="font-medium mb-3">Detailed Breakdown</h5>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Property Price:</span>
            <span>{formatCurrency(propertyPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Down Payment:</span>
            <span>{formatCurrency(parameters.downPayment)}</span>
          </div>
          <div className="flex justify-between">
            <span>Principal Amount:</span>
            <span>{formatCurrency(principalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Additional Fees:</span>
            <span>{formatCurrency(parameters.additionalFees || 0)}</span>
          </div>
          {type === FinancingType.HELOC && (
            <div className="flex justify-between">
              <span>Current Balance:</span>
              <span>{formatCurrency(parameters.currentBalance || 0)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium border-t pt-1">
            <span>Total Interest:</span>
            <span>{formatCurrency(result.totalInterest)}</span>
          </div>
        </div>
      </div>

      {/* Collapsible Amortization Schedule for Mortgage */}
      {type === FinancingType.MORTGAGE && result.amortizationSchedule && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <Button
            variant="ghost"
            onClick={() => {
              setIsScheduleExpanded(!isScheduleExpanded);
              if (!isScheduleExpanded) {
                setCurrentPage(1); // Reset to first page when expanding
              }
            }}
            className="flex items-center gap-2 p-0 h-auto font-medium mb-0"
          >
            {isScheduleExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Amortization Schedule
          </Button>

          {isScheduleExpanded && (
            <div className="space-y-4">
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
                    {currentPayments.map((payment) => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalPayments)}{' '}
                    of {totalPayments} payments
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FinancingSummary;
