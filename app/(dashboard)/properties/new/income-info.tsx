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

function IncomeInfo({
  propertyData,
  onChange,
  onNext,
  onPrev
}: {
  propertyData: { incomes: { amount: number; type: string }[] };
  onChange: (updatedData: any) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [income, setIncome] = useState({ amount: '', type: 'monthly' });

  const addIncome = () => {
    const newIncomes = [
      ...propertyData.incomes,
      { ...income, amount: Number(income.amount) }
    ];
    onChange({ incomes: newIncomes });
    setIncome({ amount: '', type: 'monthly' });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Step 2: Income Details</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium">
            Amount
          </label>
          <Input
            type="number"
            id="amount"
            value={income.amount}
            onChange={(e) => setIncome({ ...income, amount: e.target.value })}
            placeholder="Enter income amount"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            value={income.type}
            onChange={(e) => setIncome({ ...income, type: e.target.value })}
            className="w-full border rounded p-2"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <Button onClick={addIncome} size="sm">
          Add Income
        </Button>
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={onPrev} size="sm" variant="outline">
          Previous
        </Button>
        <Button onClick={onNext} size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default IncomeInfo;
