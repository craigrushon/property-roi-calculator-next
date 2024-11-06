import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Frequency } from '@prisma/client';

interface Props {
  income: { amount: string; frequency: Frequency };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onAddIncome: () => void;
}

function IncomeForm({ income, onChange, onAddIncome }: Props) {
  return (
    <div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </label>
        <Input
          type="number"
          id="amount"
          value={income.amount}
          onChange={onChange}
          placeholder="Enter income amount"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="frequency" className="block text-sm font-medium">
          Frequency
        </label>
        <select
          id="frequency"
          value={income.frequency}
          onChange={onChange}
          className="w-full border rounded p-2"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <Button onClick={onAddIncome} size="sm" aria-label="Add Income">
        Add Income
      </Button>
    </div>
  );
}

export default IncomeForm;
