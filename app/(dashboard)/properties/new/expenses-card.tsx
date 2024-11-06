'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Expense } from './actions';
import { Frequency } from '@prisma/client';
import ExpenseInfoForm from '../expense-form';

const defaultExpense = {
  amount: '',
  frequency: 'monthly' as Frequency,
  name: ''
};

function ExpensesCard({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setExpense((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Step 3: Expense Details</h2>
      </CardHeader>
      <CardContent>
        <ExpenseInfoForm
          expense={expense}
          onChange={handleChange}
          onAddExpense={addExpense}
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

export default ExpensesCard;
