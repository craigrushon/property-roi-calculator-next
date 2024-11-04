'use client';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Expense {
  id: number;
  amount: number;
  type: 'monthly' | 'yearly';
  name: string;
}

interface Income {
  id: number;
  amount: number;
  type: 'monthly' | 'yearly';
}

interface Property {
  id: number;
  address: string;
  price: number;
  incomes: Income[];
  expenses: Expense[];
}

function PropertyDisplay({ property }: { property: Property }) {
  const [propertyData, setPropertyData] = useState(property);

  const handleEditPropertyInfo = () => {
    console.log('Edit property info clicked');
  };

  const handleAddExpense = () => {
    console.log('Add expense clicked');
  };

  const handleDeleteExpense = (id: number) => {
    const updatedExpenses = propertyData.expenses.filter(
      (expense) => expense.id !== id
    );
    setPropertyData({ ...propertyData, expenses: updatedExpenses });
  };

  const handleAddIncome = () => {
    console.log('Add income clicked');
  };

  const handleDeleteIncome = (id: number) => {
    const updatedIncomes = propertyData.incomes.filter(
      (income) => income.id !== id
    );
    setPropertyData({ ...propertyData, incomes: updatedIncomes });
  };

  return (
    <div className="space-y-6">
      {/* Property Information Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold">Property Information</h2>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Address:</strong> {propertyData.address}
          </p>
          <p>
            <strong>Price:</strong> ${propertyData.price.toLocaleString()}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleEditPropertyInfo} size="sm" variant="outline">
            Edit
          </Button>
        </CardFooter>
      </Card>

      {/* Expenses Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold">Expenses</h2>
        </CardHeader>
        <CardContent>
          {propertyData.expenses.length > 0 ? (
            <ul className="space-y-4">
              {propertyData.expenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p>
                      <strong>Name:</strong> {expense.name}
                    </p>
                    <p>
                      <strong>Amount:</strong> $
                      {expense.amount.toLocaleString()}
                    </p>
                    <p>
                      <strong>Type:</strong> {expense.type}
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

      {/* Income Streams Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold">Income Streams</h2>
        </CardHeader>
        <CardContent>
          {propertyData.incomes.length > 0 ? (
            <ul className="space-y-4">
              {propertyData.incomes.map((income) => (
                <li
                  key={income.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p>
                      <strong>Amount:</strong> ${income.amount.toLocaleString()}
                    </p>
                    <p>
                      <strong>Type:</strong> {income.type}
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
    </div>
  );
}

export default PropertyDisplay;
