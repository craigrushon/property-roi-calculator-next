import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Frequency } from '@prisma/client';
import { useState } from 'react';

const defaultIncome = {
  amount: '',
  frequency: 'monthly' as Frequency
};

interface Props {
  onAddIncome: (income: { amount: string; frequency: Frequency }) => void;
}

function ControlledIncomeFields({ onAddIncome }: Props) {
  const [income, setIncome] = useState(defaultIncome);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setIncome((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddIncome = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!income.amount || Number(income.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setError(null);
    onAddIncome({ ...income, amount: income.amount.trim() });
    setIncome(defaultIncome);
  };

  const frequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </label>
        <Input
          type="number"
          id="amount"
          name="amount"
          value={income.amount}
          onChange={handleChange}
          placeholder="Enter income amount"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="frequency" className="block text-sm font-medium">
          Frequency
        </label>
        <select
          id="frequency"
          name="frequency"
          value={income.frequency}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {frequencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <Button
        type="button"
        onClick={handleAddIncome}
        size="sm"
        aria-label="Add Income"
      >
        Add Income
      </Button>
    </div>
  );
}

export default ControlledIncomeFields;
