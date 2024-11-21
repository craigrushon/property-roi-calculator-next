'use client';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expense } from 'models/types';
import ExpenseRow from './expense-row';
import { createExpense } from '../actions';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import ExpenseForm from './expense-form';
import ExpenseListItem from './expense-list-item';

interface Props {
  expenses: Expense[];
}

function ExpensesSection({ expenses }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const params = useParams();
  const propertyId = Number(params.id);

  const handleAddExpense = () => {
    setIsAdding(true);
  };

  const handleCreateExpense = async (formData: FormData) => {
    formData.set('propertyId', propertyId.toString());
    try {
      await createExpense(formData);
      setIsAdding(false);
      return;
    } catch {
      throw new Error('Failed to create the expense. Please try again.');
    }
  };

  const handleCancelCreate = () => {
    setIsAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Expenses</h2>
      </CardHeader>
      <CardContent>
        <ul>
          {expenses.map((expense) => (
            <ExpenseRow key={expense.id} expense={expense} />
          ))}
          {isAdding && (
            <ExpenseListItem>
              <ExpenseForm
                key="new-expense"
                initialData={{ name: '', amount: 0, frequency: 'monthly' }}
                onCancel={handleCancelCreate}
                primaryAction={{
                  label: 'Create',
                  action: handleCreateExpense
                }}
              />
            </ExpenseListItem>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        {!isAdding && (
          <Button onClick={handleAddExpense} size="sm" variant="outline">
            Add Expense
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ExpensesSection;
