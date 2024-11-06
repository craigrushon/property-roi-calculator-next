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
import { PropertyData } from './property-onboarding';
import { Frequency } from '@prisma/client';
import { Income } from './actions';

const defaultIncome = {
  amount: '',
  frequency: 'monthly' as Frequency
};

function IncomeInfo({
  propertyData,
  onChange,
  onNext,
  onPrev
}: {
  propertyData: PropertyData;
  onChange: (updatedData: { incomes: Income[] }) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [income, setIncome] = useState({ ...defaultIncome });

  const addIncome = () => {
    const newIncomes = [
      ...propertyData.incomes,
      { ...income, amount: Number(income.amount) }
    ];
    onChange({ incomes: newIncomes });
    setIncome({ ...defaultIncome });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome({ ...income, amount: e.target.value });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIncome({ ...income, frequency: e.target.value as Frequency });
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
            onChange={handleAmountChange}
            placeholder="Enter income amount"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium">
            Frequency
          </label>
          <select
            id="frequency"
            value={income.frequency}
            onChange={handleFrequencyChange}
            className="w-full border rounded p-2"
          >
            <option value={'monthly'}>Monthly</option>
            <option value={'yearly'}>Yearly</option>
          </select>
        </div>
        <Button onClick={addIncome} size="sm" aria-label="Add Income">
          Add Income
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
        <Button onClick={onNext} size="sm" aria-label="Go to Next Step">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default IncomeInfo;
