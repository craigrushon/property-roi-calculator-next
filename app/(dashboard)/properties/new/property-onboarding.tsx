'use client';
import { useState } from 'react';
import PropertyInfo from './property-info';
import IncomeInfo from './income-info';
import ExpenseInfo from './expense-info';
import { addPropertyWithDetails, Expense, Income } from './actions';

export interface PropertyData {
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
          onNext={nextStep}
        />
      )}
      {currentStep === 2 && (
        <IncomeInfo
          propertyData={propertyData}
          onChange={handlePropertyDataChange}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
      {currentStep === 3 && (
        <ExpenseInfo
          propertyData={propertyData}
          onChange={handlePropertyDataChange}
          onSubmit={handleSubmit}
          onPrev={prevStep}
        />
      )}
    </div>
  );
}

export default AddPropertyOnboarding;
