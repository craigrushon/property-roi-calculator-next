import { notFound } from 'next/navigation';
import GeneralInfoSection from '../components/info-section';
import ExpensesSection from '../components/expenses-section';
import IncomesSection from '../components/incomes-section';
import FinancingSection from '../components/financing-section';
import { getPropertyById } from 'prisma/helpers/property';

export default async function PropertyEditPage({
  params
}: {
  params: { id: string };
}) {
  const propertyId = Number(params.id);

  if (isNaN(propertyId)) {
    notFound();
  }

  const property = await getPropertyById(propertyId);

  if (!property) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Property Details</h1>
      <div className="space-y-6">
        <GeneralInfoSection
          currentData={{ ...property, price: property.price.toString() }}
        />
        <FinancingSection
          propertyPrice={property.price}
          currentFinancing={property.financing}
        />
        <ExpensesSection expenses={property.expenses} />
        <IncomesSection incomes={property.incomes} />
      </div>
    </div>
  );
}
