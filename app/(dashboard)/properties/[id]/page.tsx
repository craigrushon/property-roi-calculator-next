// /properties/[id]/page.tsx
import { notFound } from 'next/navigation';
import PropertyDisplay from './property-display';
import prisma from 'lib/prisma'; // Ensure the Prisma client is imported correctly
import { ExpenseType } from '../new/property-onboarding';

export default async function PropertyPage({
  params
}: {
  params: { id: string };
}) {
  const propertyId = Number(params.id);

  if (isNaN(propertyId)) {
    notFound();
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      incomes: true,
      expenses: true
    }
  });

  if (!property) {
    notFound();
  }

  // Transform the property data if necessary
  const propertyData = {
    id: property.id,
    address: property.address,
    price: Number(property.price),
    incomes: property.incomes.map((income) => ({
      id: income.id,
      amount: Number(income.amount),
      type: income.type as 'monthly' | 'yearly'
    })),
    expenses: property.expenses.map((expense) => ({
      id: expense.id,
      amount: Number(expense.amount),
      type: expense.type as ExpenseType,
      name: expense.name
    }))
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Property Details</h1>
      <PropertyDisplay property={propertyData} />
    </div>
  );
}
