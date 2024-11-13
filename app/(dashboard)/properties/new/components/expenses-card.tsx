'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Expense } from 'app/(dashboard)/properties/actions';
import { Frequency } from '@prisma/client';
import ExpenseForm from './expense-form';

const defaultExpense = {
  amount: '',
  frequency: 'monthly' as Frequency,
  name: ''
};

function ExpensesCard({
  expenses,
  onChange,
  onSubmit,
  onPrev
}: {
  expenses: Expense[];
  onChange: (updatedData: { expenses: Expense[] }) => void;
  onSubmit: () => void;
  onPrev: () => void;
}) {
  const [expense, setExpense] = useState({ ...defaultExpense });

  const addExpense = () => {
    const newExpenses = [
      ...expenses,
      { ...expense, amount: Number(expense.amount) }
    ];
    onChange({ expenses: newExpenses });
    setExpense({ ...defaultExpense });
  };

  const handleChange = (id: string, value: string) => {
    setExpense((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-center">
          Step 3: Expense Details
        </h2>
        <p className="text-l text-center">
          List the property's recurring expenses.
        </p>
      </CardHeader>
      <CardContent>
        <ExpenseForm
          expense={expense}
          onChange={handleChange}
          onAddExpense={addExpense}
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