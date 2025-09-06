'use client';

import { Button } from '@/components/ui/button';
import { Income } from 'models/types';
import { useState } from 'react';
import IncomeForm from './income-form';
import ListItem from '../list-item';
import { deleteIncome, updateIncome } from '../../../actions';

interface Props {
  unitIdentifier: string;
  income: Income;
}

function IncomeRow({ unitIdentifier, income }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (formData: FormData) => {
    await updateIncome(formData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteIncome(income.id);
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  return (
    <ListItem onClick={() => !isEditing && setIsEditing(true)}>
      {isEditing ? (
        <IncomeForm
          initialData={{
            amount: income.amount,
            frequency: income.frequency
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
            <p className="font-bold">Unit #{unitIdentifier}</p>
            <p className="text-sm">
              <span className="font-light">
                ${income.amount.toLocaleString()}
              </span>{' '}
              <span className="font-medium">{income.frequency}</span>
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
            <Button onClick={handleDelete} size="sm" variant="destructive">
              Delete
            </Button>
          </div>
        </>
      )}
    </ListItem>
  );
}

export default IncomeRow;
