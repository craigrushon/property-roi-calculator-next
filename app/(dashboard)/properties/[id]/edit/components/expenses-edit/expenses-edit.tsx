'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { Expense } from 'models/types';
import ExpenseRow from './expense-row';
import { createExpense } from '../../../actions';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import ExpenseForm from './expense-form';
import ListItem from '../list-item';

interface Props {
  expenses: Expense[];
}

function ExpensesEdit({ expenses }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const params = useParams();
  const propertyId = Number(params.id);

  const handleAddExpense = () => {
    setIsAdding(true);
  };

  const handleCreateExpense = async (formData: FormData) => {
    formData.set('propertyId', propertyId.toString());

    await createExpense(formData);
    setIsAdding(false);
  };

  const handleCancelCreate = () => {
    setIsAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Expenses</span>
          <Link href={`/properties/${propertyId}/edit?focus=expenses`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {expenses.map((expense) => (
            <ExpenseRow key={expense.id} expense={expense} />
          ))}
          {isAdding && (
            <ListItem>
              <ExpenseForm
                key="new-expense"
                initialData={{ frequency: 'monthly' }}
                onCancel={handleCancelCreate}
                primaryAction={{
                  label: 'Create',
                  action: handleCreateExpense
                }}
              />
            </ListItem>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        {!isAdding && (
          <Button onClick={handleAddExpense} size="sm" variant="outline">
            Add Expense
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ExpensesEdit;
