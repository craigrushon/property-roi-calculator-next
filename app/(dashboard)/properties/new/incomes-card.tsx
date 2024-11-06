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
import { Income } from './actions';
import IncomeInfoForm from '../income-form';

const defaultIncome = {
  amount: '',
  frequency: 'monthly' as Frequency
};

function IncomesCard({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setIncome((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Step 2: Income Details</h2>
      </CardHeader>
      <CardContent>
        <IncomeInfoForm
          income={income}
          onChange={handleChange}
          onAddIncome={addIncome}
        />
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

export default IncomesCard;
