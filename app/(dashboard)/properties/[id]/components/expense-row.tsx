'use client';

import { Button } from '@/components/ui/button';
import { Expense } from 'models/types';
import { useState } from 'react';
import ExpenseForm from './expense-form';
import ExpenseListItem from './expense-list-item';
import { deleteExpense, updateExpense } from '../actions';

interface Props {
  expense: Expense;
  editingByDefault?: boolean;
}

function ExpenseRow({ expense, editingByDefault = false }: Props) {
  const [isEditing, setIsEditing] = useState(editingByDefault);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (formData: FormData) => {
    try {
      await updateExpense(formData);
      setIsEditing(false);
    } catch {
      throw new Error('Failed to update the expense. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExpense(expense.id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <ExpenseListItem onClick={() => !isEditing && setIsEditing(true)}>
      {isEditing ? (
        <ExpenseForm
          initialData={{
            name: expense.name,
            amount: expense.amount,
            frequency: expense.frequency
          }}
          onCancel={handleCancel}
          primaryAction={{
            label: 'Save',
            action: handleSave
          }}
        />
      ) : (
        <>
          <div className="text-[14px]">
            <p className="font-bold">{expense.name}</p>
            <p className="text-sm">
              <span className="font-light">
                ${expense.amount.toLocaleString()}
              </span>{' '}
              <span className="font-medium">{expense.frequency}</span>
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="outline"
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete()}
              size="sm"
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </ExpenseListItem>
  );
}

export default ExpenseRow;
