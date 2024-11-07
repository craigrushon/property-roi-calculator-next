import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Frequency } from '@prisma/client';

interface Props {
  expense: { amount: string; frequency: Frequency; name: string };
  onChange: (id: string, value: string) => void;
  onAddExpense: () => void;
}

function ExpenseForm({ expense, onChange, onAddExpense }: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    onChange(id, value);
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium">
          Expense Name
        </label>
        <Input
          type="text"
          id="name"
          value={expense.name}
          onChange={handleChange}
          placeholder="Enter expense name"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </label>
        <Input
          type="number"
          id="amount"
          value={expense.amount}
          onChange={handleChange}
          placeholder="Enter expense amount"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="frequency" className="block text-sm font-medium">
          Frequency
        </label>
        <select
          id="frequency"
          value={expense.frequency}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <Button onClick={onAddExpense} size="sm" className="mt-2">
        Add Expense
      </Button>
    </div>
  );
}

export default ExpenseForm;
