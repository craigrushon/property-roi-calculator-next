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
import { deleteExpense, editExpense } from '../actions';

interface Props {
  expenses: Expense[];
}

function ExpensesSection({ expenses }: Props) {
  const handleAddExpense = () => {
    console.log('Add expense clicked');
  };

  const onSave = async (formData: FormData) => {
    await editExpense(formData);
  };

  const onDelete = async (id: number) => {
    await deleteExpense(id);
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
