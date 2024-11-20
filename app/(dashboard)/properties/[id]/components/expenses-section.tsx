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
import { addExpense, deleteExpense, editExpense } from '../actions';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Props {
  expenses: Expense[];
}

function ExpensesSection({ expenses }: Props) {
  const params = useParams();
  const propertyId = Number(params.id);

  const handleAddExpense = async () => {
    const formData = new FormData();
    formData.set('propertyId', propertyId.toString());
    formData.set('name', 'New Expense'); // Example default values
    formData.set('amount', '0');
    formData.set('frequency', 'monthly');

    try {
      await addExpense(formData);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const onSave = async (formData: FormData) => {
    await editExpense(formData);
  };

  const onDelete = async (id: number) => {
    try {
      await deleteExpense(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Expenses</h2>
      </CardHeader>
      <CardContent>
        {expenses.length > 0 ? (
          <ul>
            {expenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                onDelete={onDelete}
                onSave={onSave}
              />
            ))}
          </ul>
        ) : (
          <p>No expenses added.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddExpense} size="sm" variant="outline">
          Add Expense
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ExpensesSection;
