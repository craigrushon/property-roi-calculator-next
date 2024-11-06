'use client';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Income } from 'models/types';

interface Props {
  incomes: Income[];
}

function IncomesCard({ incomes }: Props) {
  const handleAddIncome = () => {
    console.log('Add income clicked');
  };

  const handleDeleteIncome = (id: number) => {
    console.log('Delete income clicked', id);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Income Streams</h2>
      </CardHeader>
      <CardContent>
        {incomes.length > 0 ? (
          <ul className="space-y-4">
            {incomes.map((income) => (
              <li
                key={income.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p>
                    <strong>Amount:</strong> ${income.amount.toLocaleString()}
                  </p>
                  <p>
                    <strong>Frequency:</strong> {income.frequency}
                  </p>
                </div>
                <Button
                  onClick={() => handleDeleteIncome(income.id)}
                  size="sm"
                  variant="destructive"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No income streams added.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddIncome} size="sm" variant="outline">
          Add Income
        </Button>
      </CardFooter>
    </Card>
  );
}

export default IncomesCard;
