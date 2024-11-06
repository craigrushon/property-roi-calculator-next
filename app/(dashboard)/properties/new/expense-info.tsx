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
import { Expense, ExpenseType } from './property-onboarding';

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
  const [expense, setExpense] = useState({
    amount: '',
    type: ExpenseType.Monthly,
    name: ''
  });

  const addExpense = () => {
    const newExpenses = [
      ...propertyData.expenses,
      { ...expense, amount: Number(expense.amount) }
    ];
    onChange({ expenses: newExpenses });
    setExpense({ amount: '', type: ExpenseType.Monthly, name: '' });
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
            onChange={(e) => setExpense({ ...expense, name: e.target.value })}
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
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            placeholder="Enter expense amount"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            value={expense.type}
            onChange={(e) =>
              setExpense({ ...expense, type: e.target.value as ExpenseType })
            }
            className="w-full border rounded p-2"
          >
            <option value={ExpenseType.Monthly}>Monthly</option>
            <option value={ExpenseType.Yearly}>Yearly</option>
          </select>
        </div>
        <Button onClick={addExpense} size="sm" className="mt-2">
          Add Expense
        </Button>
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={onPrev} size="sm" variant="outline">
          Previous
        </Button>
        <Button onClick={onSubmit} size="sm">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ExpenseInfo;
