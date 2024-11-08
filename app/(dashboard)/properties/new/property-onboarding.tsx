'use client';
import { useState } from 'react';
import PropertyCard from './property-card';
import IncomesCard from './incomes-card';
import ExpensesCard from './expenses-card';
import { addPropertyWithDetails, Expense, Income } from '../actions';
import { logError } from '@/lib/utils';

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
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

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
    setErrorMessages([]);
    setSuccessMessage('');
    try {
      await addPropertyWithDetails({
        address: propertyData.address,
        price: Number(propertyData.price),
        incomes: propertyData.incomes,
        expenses: propertyData.expenses
      });
      setSuccessMessage('Property added successfully!');
    } catch (error) {
      logError(error);
      setErrorMessages(['An error occurred while adding the property.']);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Step Indicators */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3].map((step) => (
            <button
              onClick={() => setCurrentStep(step)}
              key={step}
              className={`h-4 w-4 rounded-full mx-2 ${
                currentStep === step ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Error and Success Messages */}
        {errorMessages.length > 0 && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            <ul>
              {errorMessages.map((error, index) => (
                <li key={index} role="alert">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="bg-green-100 text-green-700 p-4 rounded-md"
          >
            {successMessage}
          </div>
        )}

        {currentStep === 1 && (
          <PropertyCard
            propertyData={propertyData}
            onChange={handlePropertyDataChange}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <IncomesCard
            incomes={propertyData.incomes}
            onChange={handlePropertyDataChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        {currentStep === 3 && (
          <ExpensesCard
            expenses={propertyData.expenses}
            onChange={handlePropertyDataChange}
            onSubmit={handleSubmit}
            onPrev={prevStep}
          />
        )}
      </div>
    </div>
  );
}

export default AddPropertyOnboarding;
