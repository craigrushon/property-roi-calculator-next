import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from 'components/ui/button';
import { GeneralInfoEdit, FinancingEdit, FocusHandler } from './components';
import ExpensesSection from '../components/expenses-section';
import IncomesSection from '../components/incomes-section';
import { getPropertyById } from 'prisma/helpers/property';

export default async function PropertyEditPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { focus?: string };
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
      <FocusHandler focus={searchParams.focus} />
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
        <div id="general-section">
          <GeneralInfoEdit
            currentData={{ ...property, price: property.price.toString() }}
          />
        </div>
        <div id="financing-section">
          <FinancingEdit
            propertyPrice={property.price}
            currentFinancing={property.financing}
          />
        </div>
        <div id="expenses-section">
          <ExpensesSection expenses={property.expenses} />
        </div>
        <div id="incomes-section">
          <IncomesSection incomes={property.incomes} />
        </div>
      </form>
    </div>
  );
}
