'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FinancingType } from 'models/financing/types';
import {
  updatePropertyFinancingAction,
  clearPropertyFinancingAction
} from '../actions';
import FinancingTypeSelector from './financing-type-selector';
import FinancingForm from './financing-form';
import FinancingResults from './financing-results';

interface Props {
  propertyPrice: number;
  currentFinancing?: {
    type: string;
    downPayment?: number;
    interestRate?: number;
    loanTermYears?: number;
    additionalFees?: number;
    currentBalance?: number;
  };
}

function FinancingSection({ propertyPrice, currentFinancing }: Props) {
  const [selectedType, setSelectedType] = useState<FinancingType>(
    (currentFinancing?.type as FinancingType) || FinancingType.MORTGAGE
  );
  const [formData, setFormData] = useState({
    downPayment: currentFinancing?.downPayment || 0,
    interestRate: currentFinancing?.interestRate || 6.5,
    loanTermYears: currentFinancing?.loanTermYears || 30,
    additionalFees: currentFinancing?.additionalFees || 0,
    currentBalance: currentFinancing?.currentBalance || 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!currentFinancing);

  const params = useParams();
  const propertyId = Number(params.id);

  const handleTypeChange = (type: FinancingType) => {
    setSelectedType(type);
    setError(null);
  };

  const handleFormChange = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.set('propertyId', propertyId.toString());
      formDataObj.set('financingType', selectedType);
      formDataObj.set('downPayment', formData.downPayment.toString());
      formDataObj.set('interestRate', formData.interestRate.toString());
      formDataObj.set('loanTermYears', formData.loanTermYears.toString());
      formDataObj.set('additionalFees', formData.additionalFees.toString());

      if (selectedType === FinancingType.HELOC) {
        formDataObj.set('currentBalance', formData.currentBalance.toString());
      }

      await updatePropertyFinancingAction(formDataObj);
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await clearPropertyFinancingAction(propertyId);
      setSelectedType(FinancingType.MORTGAGE);
      setFormData({
        downPayment: 0,
        interestRate: 6.5,
        loanTermYears: 30,
        additionalFees: 0,
        currentBalance: 0
      });
      setIsEditing(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Reset form data to current values
    setFormData({
      downPayment: currentFinancing?.downPayment || 0,
      interestRate: currentFinancing?.interestRate || 6.5,
      loanTermYears: currentFinancing?.loanTermYears || 30,
      additionalFees: currentFinancing?.additionalFees || 0,
      currentBalance: currentFinancing?.currentBalance || 0
    });
    setSelectedType(
      (currentFinancing?.type as FinancingType) || FinancingType.MORTGAGE
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Financing Configuration</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <FinancingTypeSelector
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          disabled={!isEditing}
        />

        <FinancingForm
          type={selectedType}
          propertyPrice={propertyPrice}
          formData={formData}
          onFormChange={handleFormChange}
          disabled={!isEditing}
        />

        {!isEditing && (
          <FinancingResults
            type={selectedType}
            propertyPrice={propertyPrice}
            formData={formData}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <div className="space-x-2">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Financing'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button
              onClick={handleClear}
              variant="destructive"
              disabled={isLoading}
            >
              {isLoading ? 'Clearing...' : 'Clear Financing'}
            </Button>
            <Button onClick={handleEdit} variant="outline" disabled={isLoading}>
              Edit
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default FinancingSection;
