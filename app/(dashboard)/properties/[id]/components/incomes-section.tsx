'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Income } from 'models/types';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import IncomeRow from './income-row';
import IncomeForm from './income-form';
import ListItem from './list-item';
import { createIncome } from '../actions';

interface Props {
  incomes: Income[];
}

function IncomesSection({ incomes }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const params = useParams();
  const propertyId = Number(params.id);

  const handleAddIncome = () => {
    setIsAdding(true);
  };

  const handleCreateIncome = async (formData: FormData) => {
    formData.set('propertyId', propertyId.toString());

    await createIncome(formData);

    setIsAdding(false);
  };

  const handleCancelCreate = () => {
    setIsAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Income Streams</h2>
      </CardHeader>
      <CardContent>
        <ul>
          {incomes.map((income, index) => (
            <IncomeRow
              key={income.id}
              unitIdentifier={`${index + 1}`}
              income={income}
            />
          ))}
          {isAdding && (
            <ListItem>
              <IncomeForm
                initialData={{ frequency: 'monthly' }}
                onCancel={handleCancelCreate}
                primaryAction={{
                  label: 'Create',
                  action: handleCreateIncome
                }}
              />
            </ListItem>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        {!isAdding && (
          <Button onClick={handleAddIncome} size="sm" variant="outline">
            Add Income
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default IncomesSection;
