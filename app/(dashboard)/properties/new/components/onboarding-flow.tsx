'use client';

import { useState } from 'react';
import OnboardingStepCard from './onboarding-step-card';
import PropertyForm from './controlled-property-fields';
import IncomeForm from './controlled-income-fields';
import ExpenseForm from './controlled-expense-fields';
import {
  addPropertyWithDetails,
  Expense,
  Income
} from 'app/(dashboard)/properties/actions';
import { logError } from '@/lib/utils';
import { Frequency } from '@prisma/client';
import ControlledExpenseFields from './controlled-expense-fields';
import ControlledIncomeFields from './controlled-income-fields';
import ControlledPropertyFields from './controlled-property-fields';

function PropertyOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddIncome = (newIncome: {
    amount: string;
    frequency: Frequency;
  }) => {
    setIncomes((prev) => [
      ...prev,
      { ...newIncome, amount: Number(newIncome.amount) }
    ]);
  };

  const handleAddExpense = (newExpense: {
    name: string;
    amount: string;
    frequency: Frequency;
  }) => {
    setExpenses((prev) => [
      ...prev,
      { ...newExpense, amount: Number(newExpense.amount) }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage('');

    const formData = new FormData(e.currentTarget);
    const address = formData.get('address') as string;
    const price = formData.get('price') as string;

    try {
      await addPropertyWithDetails({
        address,
        price: Number(price),
        incomes,
        expenses
      });
      setSuccessMessage('Property added successfully!');
    } catch (error) {
      logError(error);
      setErrorMessages(['An error occurred while adding the property.']);
    }
  };

  const handleClearError = () => {
    setErrorMessages([]); // Clear error messages on form interaction
  };

  const stepContent = [
    {
      title: 'Step 1: Property Information',
      description:
        "Enter the property's basic information, such as the address and price.",
      content: <></>, // `PropertyForm` is always rendered below, so no additional content needed
      primaryAction: {
        label: 'Next',
        onClick: () => setCurrentStep((prev) => Math.min(prev + 1, 3))
      }
    },
    {
      title: 'Step 2: Income Details',
      description: "Provide details about the property's income sources.",
      content: <ControlledIncomeFields onAddIncome={handleAddIncome} />,
      primaryAction: {
        label: 'Next',
        onClick: () => setCurrentStep((prev) => Math.min(prev + 1, 3))
      },
      secondaryAction: {
        label: 'Previous',
        onClick: () => setCurrentStep((prev) => Math.max(prev - 1, 1))
      }
    },
    {
      title: 'Step 3: Expense Details',
      description: "List the property's recurring expenses.",
      content: <ControlledExpenseFields onAddExpense={handleAddExpense} />,
      primaryAction: {
        label: 'Create Property',
        onClick: () =>
          document
            .getElementById('propertyForm')
            ?.dispatchEvent(new Event('submit', { bubbles: true }))
      },
      secondaryAction: {
        label: 'Previous',
        onClick: () => setCurrentStep((prev) => Math.max(prev - 1, 1))
      }
    }
  ];

  const { title, description, content, primaryAction, secondaryAction } =
    stepContent[currentStep - 1];

  return (
    <div
      className="flex items-center justify-center"
      onClick={handleClearError}
      onFocus={handleClearError}
    >
      <form
        id="propertyForm"
        onSubmit={handleSubmit}
        className="w-full max-w-lg"
      >
        {/* Hidden fields for incomes and expenses */}
        <input type="hidden" name="incomes" value={JSON.stringify(incomes)} />
        <input type="hidden" name="expenses" value={JSON.stringify(expenses)} />

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

        <OnboardingStepCard
          title={title}
          description={description}
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
        >
          {content}

          {/* Always render but conditionally hide property form fields */}
          <div className={currentStep !== 1 ? 'sr-only' : ''}>
            <ControlledPropertyFields />
          </div>
        </OnboardingStepCard>
      </form>
    </div>
  );
}

export default PropertyOnboardingFlow;
