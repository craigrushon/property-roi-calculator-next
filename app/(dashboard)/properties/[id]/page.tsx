import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from 'components/ui/button';
import GeneralInfoSection from './components/info-section';
import ExpensesSection from './components/expenses-section';
import IncomesSection from './components/incomes-section';
import { FinancingDisplay } from './components/financing';
import { getPropertyById } from 'prisma/helpers/property';

export default async function PropertyPage({
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Property Details</h1>
        <Link href={`/properties/${propertyId}/edit`}>
          <Button>Edit Property</Button>
        </Link>
      </div>
      <div className="space-y-6">
        <GeneralInfoSection
          currentData={{ ...property, price: property.price.toString() }}
        />
        <FinancingDisplay
          propertyPrice={property.price}
          currentFinancing={property.financing}
        />
        <ExpensesSection expenses={property.expenses} />
        <IncomesSection incomes={property.incomes} />
      </div>
    </div>
  );
}
