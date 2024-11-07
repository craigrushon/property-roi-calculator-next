import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Frequency } from '@prisma/client';

interface Props {
  income: { amount: string; frequency: Frequency };
  onChange: (id: string, value: string) => void;
  onAddIncome: () => void;
}

function IncomeForm({ income, onChange, onAddIncome }: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    onChange(id, value);
  };

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
          onChange={handleChange}
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
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value={Frequency['monthly']}>Monthly</option>
          <option value={Frequency['yearly']}>Yearly</option>
        </select>
      </div>
      <Button onClick={onAddIncome} size="sm" aria-label="Add Income">
        Add Income
      </Button>
    </div>
  );
}

export default IncomeForm;
