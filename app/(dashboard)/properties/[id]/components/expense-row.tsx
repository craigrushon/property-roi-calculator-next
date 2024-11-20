'use client';
import { Button } from '@/components/ui/button';
import DeleteModal from 'app/(dashboard)/components/delete-modal';
import { useModal } from 'app/components/modal';
import { Expense } from 'models/types';
import { useState } from 'react';

interface Props {
  expense: Expense;
  onDelete: (id: number) => Promise<void>;
  onSave: (formData: FormData) => Promise<void>;
  isOpen?: boolean;
}

function ExpenseRow({ expense, onDelete, onSave, isOpen = false }: Props) {
  const [isEditing, setIsEditing] = useState(isOpen);
  const [formState, setFormState] = useState({
    name: expense.name,
    amount: expense.amount.toString(),
    frequency: expense.frequency
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showModal, hideModal } = useModal();

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
    <li
      className="flex cursor-pointer justify-between items-center rounded-md border-b p-6 hover:bg-slate-100"
      onClick={() => {
        if (isEditing) {
          return;
        } else {
          setIsEditing(true);
        }
      }}
    >
      {error && (
        <p className="text-red-500 text-sm" aria-live="polite">
          {error}
        </p>
      )}
      {!isEditing ? (
        <>
          <div className="text-[14px]">
            <p className="font-bold">{expense.name}</p>
            <p className="text-sm">
              {' '}
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
              onClick={(e) => {
                e.stopPropagation();
                showModal(
                  <DeleteModal
                    onConfirm={async () => {
                      if (onDelete) await onDelete(expense.id);
                      hideModal();
                    }}
                    onCancel={hideModal}
                  />
                );
              }}
              size="sm"
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </>
      ) : (
        <form className="space-y-5 w-full" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border p-1 w-full text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={formState.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="border p-1 w-full text-sm"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Frequency</label>
            <select
              name="frequency"
              value={formState.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
              className="border p-1 w-full text-sm"
              required
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex space-x-2 pb-4">
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
              onClick={() => handleCancel()}
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
