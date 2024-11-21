'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  initialData: {
    name: string;
    amount: number;
    frequency: string;
  };
  onCancel: () => void;
  primaryAction: {
    label: string;
    action: (formData: FormData) => Promise<void>;
  };
}

function ExpenseForm({ initialData, onCancel, primaryAction }: Props) {
  const [formState, setFormState] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.set('name', formState.name);
    formData.set('amount', formState.amount.toString());
    formData.set('frequency', formState.frequency);

    try {
      await primaryAction.action(formData);
    } catch (error: Error | any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5 w-full" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="expense-name"
          className="block text-sm mb-1 font-medium"
        >
          Name
        </label>
        <input
          id="expense-name"
          type="text"
          name="name"
          value={formState.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="border p-1 w-full text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="expense-amount"
          className="block text-sm mb-1 font-medium"
        >
          Amount
        </label>
        <input
          id="expense-amount"
          type="number"
          name="amount"
          value={formState.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          className="border p-1 w-full text-sm"
          step="0.01"
        />
      </div>
      <div>
        <label
          htmlFor="expense-frequency"
          className="block text-sm mb-1 font-medium"
        >
          Frequency
        </label>
        <select
          id="expense-frequency"
          name="frequency"
          value={formState.frequency}
          onChange={(e) => handleInputChange('frequency', e.target.value)}
          className="border p-1 w-full text-sm"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex space-x-2">
        <Button type="submit" size="sm" variant="default" disabled={isLoading}>
          {isLoading ? 'Saving...' : primaryAction.label}
        </Button>
        <Button type="button" onClick={onCancel} size="sm" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ExpenseForm;
