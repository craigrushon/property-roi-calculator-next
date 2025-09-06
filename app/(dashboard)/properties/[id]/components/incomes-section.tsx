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
        <CardTitle className="flex items-center justify-between">
          <span>Income Streams</span>
          <Link href={`/properties/${propertyId}/edit?focus=incomes`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
        </CardTitle>
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
