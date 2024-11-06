'use client';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expense } from 'models/types';

interface Props {
  expenses: Expense[];
}

function ExpensesCard({ expenses }: Props) {
  const handleAddExpense = () => {
    console.log('Add expense clicked');
  };

  const handleDeleteExpense = (id: number) => {
    console.log('Delete expense clicked', id);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Expenses</h2>
      </CardHeader>
      <CardContent>
        {expenses.length > 0 ? (
          <ul className="space-y-4">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex justify-between items-center border-b pb-2"
              >
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
                <Button
                  onClick={() => handleDeleteExpense(expense.id)}
                  size="sm"
                  variant="destructive"
                >
                  Delete
                </Button>
              </li>
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

export default ExpensesCard;
