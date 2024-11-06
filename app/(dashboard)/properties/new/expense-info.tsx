'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Expense } from './actions';
import { Frequency } from '@prisma/client';

const defaultExpense = {
  amount: '',
  frequency: 'monthly' as Frequency,
  name: ''
};

function ExpenseInfo({
  propertyData,
  onChange,
  onSubmit,
  onPrev
}: {
  propertyData: { expenses: Expense[] };
  onChange: (updatedData: { expenses: Expense[] }) => void;
  onSubmit: () => void;
  onPrev: () => void;
}) {
  const [expense, setExpense] = useState({ ...defaultExpense });

  const addExpense = () => {
    const newExpenses = [
      ...propertyData.expenses,
      { ...expense, amount: Number(expense.amount) }
    ];
    onChange({ expenses: newExpenses });
    setExpense({ ...defaultExpense });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpense({ ...expense, name: e.target.value });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpense({ ...expense, amount: e.target.value });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExpense({ ...expense, frequency: e.target.value as Frequency });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Step 3: Expense Details</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Expense Name
          </label>
          <Input
            type="text"
            id="name"
            value={expense.name}
            onChange={handleNameChange}
            placeholder="Enter expense name"
            required
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
            onChange={handleAmountChange}
            placeholder="Enter expense amount"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="frequency" className="block text-sm font-medium">
            Frequency
          </label>
          <select
            id="frequency"
            value={expense.frequency}
            onChange={handleFrequencyChange}
            className="w-full border rounded p-2"
          >
            <option value={'monthly'}>Monthly</option>
            <option value={'yearly'}>Yearly</option>
          </select>
        </div>
        <Button onClick={addExpense} size="sm" className="mt-2">
          Add Expense
        </Button>
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          onClick={onPrev}
          size="sm"
          variant="outline"
          aria-label="Go to Previous Step"
        >
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          size="sm"
          aria-label="Submit Expense Information"
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ExpenseInfo;
