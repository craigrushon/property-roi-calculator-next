import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Frequency } from '@prisma/client';
import { useState } from 'react';

const defaultExpense = {
  name: '',
  amount: '',
  frequency: 'monthly' as Frequency
};

interface Props {
  onAddExpense: (expense: {
    name: string;
    amount: string;
    frequency: Frequency;
  }) => void;
}

function ControlledExpenseFields({ onAddExpense }: Props) {
  const [expense, setExpense] = useState(defaultExpense);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setExpense((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddExpense = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      !expense.name.trim() ||
      !expense.amount.trim() ||
      isNaN(Number(expense.amount)) ||
      Number(expense.amount) <= 0
    ) {
      setError('Please provide valid expense details.');
      return;
    }

    setError(null);
    onAddExpense({
      ...expense,
      amount: expense.amount.trim()
    });
    setExpense(defaultExpense);
  };

  const frequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium">
          Expense Name
        </label>
        <Input
          type="text"
          id="name"
          value={expense.name}
          onChange={handleChange}
          placeholder="Enter expense name"
          aria-describedby="expense-name-helper"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </label>
        <Input
          type="number"
          id="amount"
          value={expense.amount}
          onChange={handleChange}
          placeholder="Enter expense amount"
          aria-describedby="expense-amount-helper"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="frequency" className="block text-sm font-medium">
          Frequency
        </label>
        <select
          id="frequency"
          value={expense.frequency}
          onChange={handleChange}
          className="w-full border rounded p-2"
          aria-describedby="expense-frequency-helper"
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
        onClick={handleAddExpense}
        size="sm"
        className="mt-2"
        aria-label="Add Expense"
      >
        Add Expense
      </Button>
    </div>
  );
}

export default ControlledExpenseFields;
