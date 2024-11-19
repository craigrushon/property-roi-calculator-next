'use client';
import { Button } from '@/components/ui/button';
import { Expense } from 'models/types';
import { useState } from 'react';

interface Props {
  expense: Expense;
  onDelete: (id: number) => void;
  onSave: (formData: FormData) => Promise<void>;
}

function ExpenseRow({ expense, onDelete, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: expense.name,
    amount: expense.amount.toString(),
    frequency: expense.frequency
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.set('id', expense.id.toString());
    formData.set('name', formState.name);
    formData.set('amount', formState.amount);
    formData.set('frequency', formState.frequency);

    try {
      await onSave(formData);
      setIsEditing(false); // Exit edit mode on success
    } catch {
      setError('Failed to save the expense.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormState({
      name: expense.name,
      amount: expense.amount.toString(),
      frequency: expense.frequency
    });
    setIsEditing(false);
  };

  return (
    <li className="flex justify-between items-center border-b pb-2">
      {error && (
        <p className="text-red-500 text-sm" aria-live="polite">
          {error}
        </p>
      )}
      {!isEditing ? (
        <>
          <div>
            <p>
              <strong>Name:</strong> {expense.name}
            </p>
            <p>
              <strong>Amount:</strong> ${expense.amount.toLocaleString()}
            </p>
            <p>
              <strong>Frequency:</strong> {expense.frequency}
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
              onClick={() => onDelete(expense.id)}
              size="sm"
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </>
      ) : (
        <form className="space-y-2 w-full" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">
              Name
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="border p-1 w-full"
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Amount
              <input
                type="number"
                name="amount"
                value={formState.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="border p-1 w-full"
                step="0.01"
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Frequency
              <select
                name="frequency"
                value={formState.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                className="border p-1 w-full"
                required
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
          </div>
          <div className="flex space-x-2 mt-2">
            <Button
              type="submit"
              size="sm"
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              size="sm"
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </li>
  );
}

export default ExpenseRow;
