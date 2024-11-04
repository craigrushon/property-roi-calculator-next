'use client';
import { useState } from 'react';
import PropertyInfo from './property-info';
import IncomeInfo from './income-info';
import ExpenseInfo from './expense-info';
import { Button } from '@/components/ui/button';
import { addPropertyWithDetails } from './actions';

export interface Income {
  amount: number;
  type: 'monthly' | 'yearly';
}

export enum ExpenseType {
  Monthly = 'monthly',
  Yearly = 'yearly'
}

export interface Expense {
  amount: number;
  type: ExpenseType;
  name: string;
}

interface PropertyData {
  address: string;
  price: string;
  incomes: Income[];
  expenses: Expense[];
}

function AddPropertyOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyData, setPropertyData] = useState<PropertyData>({
    address: '',
    price: '',
    incomes: [],
    expenses: []
  });

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePropertyDataChange = (updatedData: Partial<PropertyData>) => {
    setPropertyData((prevData) => ({
      ...prevData,
      ...updatedData
    }));
  };

  const handleSubmit = async () => {
    try {
      await addPropertyWithDetails({
        address: propertyData.address,
        price: Number(propertyData.price),
        incomes: propertyData.incomes,
        expenses: propertyData.expenses
      });
      alert('Property added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the property.');
    }
  };

  return (
    <div>
      {currentStep === 1 && (
        <PropertyInfo
          propertyData={propertyData}
          onChange={handlePropertyDataChange}
        />
      )}
      {currentStep === 2 && (
        <IncomeInfo
          propertyData={propertyData}
          onChange={handlePropertyDataChange}
        />
      )}
      {currentStep === 3 && (
        <ExpenseInfo
          propertyData={propertyData}
          onChange={handlePropertyDataChange}
        />
      )}

      <div className="mt-4 flex justify-between">
        {currentStep > 1 && (
          <Button onClick={prevStep} size="sm" variant="outline">
            Previous
          </Button>
        )}
        {currentStep < 3 ? (
          <Button onClick={nextStep} size="sm">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} size="sm">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}

export default AddPropertyOnboarding;
