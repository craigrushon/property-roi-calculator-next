'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function IncomeInfo({
  propertyData,
  onChange
}: {
  propertyData: { incomes: { amount: number; type: string }[] };
  onChange: (updatedData: any) => void;
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
    <div>
      <h2 className="text-xl font-bold mb-4">Step 2: Income Details</h2>
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
    </div>
  );
}

export default IncomeInfo;
