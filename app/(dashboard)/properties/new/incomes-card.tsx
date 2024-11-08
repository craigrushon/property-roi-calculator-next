'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { PropertyData } from './property-onboarding';
import { Frequency } from '@prisma/client';
import { Income } from '../actions';
import IncomeInfoForm from '../income-form';

const defaultIncome = {
  amount: '',
  frequency: 'monthly' as Frequency
};

function IncomesCard({
  incomes,
  onChange,
  onNext,
  onPrev
}: {
  incomes: PropertyData['incomes'];
  onChange: (updatedData: { incomes: Income[] }) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [income, setIncome] = useState({ ...defaultIncome });

  const addIncome = () => {
    const newIncomes = [
      ...incomes,
      { ...income, amount: Number(income.amount) }
    ];
    onChange({ incomes: newIncomes });
    setIncome({ ...defaultIncome });
  };

  const handleChange = (id: string, value: string) => {
    setIncome((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-center">
          Step 2: Income Details
        </h2>
        <p className="text-l text-center">
          Provide details about the property's income sources.
        </p>
      </CardHeader>
      <CardContent>
        <IncomeInfoForm
          income={income}
          onChange={handleChange}
          onAddIncome={addIncome}
        />
      </CardContent>
      <CardFooter className="justify-between border-t border-t-gray-200 pt-6">
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

export default IncomesCard;
