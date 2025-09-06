import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from 'components/ui/button';
import GeneralInfoSection from '../components/info-section';
import ExpensesSection from '../components/expenses-section';
import IncomesSection from '../components/incomes-section';
import { FinancingEdit } from './components';
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <div className="flex gap-2">
          <Link href={`/properties/${propertyId}`}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button form="property-form" type="submit">
            Save Changes
          </Button>
        </div>
      </div>
      <form id="property-form" className="space-y-6">
        <GeneralInfoSection
          currentData={{ ...property, price: property.price.toString() }}
        />
        <FinancingEdit
          propertyPrice={property.price}
          currentFinancing={property.financing}
        />
        <ExpensesSection expenses={property.expenses} />
        <IncomesSection incomes={property.incomes} />
      </form>
    </div>
  );
}
