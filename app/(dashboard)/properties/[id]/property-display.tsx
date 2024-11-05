'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  imageUrl: string | null;
  incomes: Income[];
  expenses: Expense[];
}

function PropertyDisplay({ property }: { property: Property }) {
  const [propertyData, setPropertyData] = useState(property);
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleEditPropertyInfo = () => {
    console.log('Edit property info clicked');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSaveImage = async () => {
    if (newImage) {
      try {
        const formData = new FormData();
        formData.append('file', newImage);

        // Upload the image to the server using the API route
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'file-name': encodeURIComponent(newImage.name),
            'property-id': propertyData.id.toString()
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload image.');
        }

        const { filePath } = await response.json();

        // Update the property data to display the new image URL
        setPropertyData((prevData) => ({ ...prevData, imageUrl: filePath }));
        alert('Image uploaded successfully!');
        setNewImage(null); // Reset the image input state
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
      }
    }
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
          {propertyData.imageUrl && (
            <div className="mt-4">
              <Image
                alt={`Image for ${property.address}`}
                className="aspect-square rounded-md object-cover"
                height={400}
                src={`${property.imageUrl}`}
                width={400}
              />
            </div>
          )}
          <div className="mt-4">
            <label
              htmlFor="propertyImage"
              className="block text-sm font-medium mb-2"
            >
              Upload Property Image
            </label>
            <Input
              type="file"
              id="propertyImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            {newImage && (
              <Button onClick={handleSaveImage} size="sm" className="mt-2">
                Save Image
              </Button>
            )}
          </div>
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
