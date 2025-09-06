'use client';

import { FinancingType } from 'models/financing/types';

interface Props {
  selectedType: FinancingType;
  onTypeChange: (type: FinancingType) => void;
  disabled?: boolean;
}

function FinancingTypeSelector({
  selectedType,
  onTypeChange,
  disabled = false
}: Props) {
  const financingOptions = [
    {
      type: FinancingType.MORTGAGE,
      label: 'Mortgage',
      description: 'Traditional mortgage with fixed payments',
      icon: '🏠'
    },
    {
      type: FinancingType.HELOC,
      label: 'HELOC',
      description: 'Home Equity Line of Credit',
      icon: '💳'
    },
    {
      type: FinancingType.CASH,
      label: 'Cash Purchase',
      description: 'Purchase with cash (no financing)',
      icon: '💰'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Financing Type</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {financingOptions.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => !disabled && onTypeChange(option.type)}
            disabled={disabled}
            className={`
              p-4 border-2 rounded-lg text-left transition-all
              ${
                selectedType === option.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">
                  {option.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FinancingTypeSelector;
