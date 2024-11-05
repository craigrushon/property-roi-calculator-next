import { notFound } from 'next/navigation';
import prisma from 'lib/prisma'; // Ensure the Prisma client is imported correctly
import { ExpenseType } from '../new/property-onboarding';
import PropertyInfoCard from './property-info-card';
import ExpensesCard from './expenses-card';
import IncomesCard from './incomes-card';

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
    imageUrl: property.imageUrl,
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
      <div className="space-y-6">
        <PropertyInfoCard propertyData={propertyData} />
        <ExpensesCard expenses={propertyData.expenses} />
        <IncomesCard incomes={propertyData.incomes} />
      </div>
    </div>
  );
}
