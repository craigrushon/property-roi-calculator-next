import { Card, CardHeader, CardTitle, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { Expense } from 'models/types';
import EmptyState from '../empty-state';
import { formatCurrency } from 'lib/utils';

interface ExpensesDisplayProps {
  propertyId: number;
  expenses: Expense[];
}

function ExpensesDisplay({ propertyId, expenses }: ExpensesDisplayProps) {
  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  if (expenses.length === 0) {
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
          <EmptyState
            title="No Expenses"
            description="No expenses have been configured for this property."
            badgeText="No expenses configured"
          />
        </CardContent>
      </Card>
    );
  }

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
        <div className="space-y-0">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm">{expense.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(expense.amount)}{' '}
                  {formatFrequency(expense.frequency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExpensesDisplay;
