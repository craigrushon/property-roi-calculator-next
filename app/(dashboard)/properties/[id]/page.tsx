import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from 'components/ui/button';
import { GeneralInfoDisplay } from './components/general-info-display';
import { ExpensesDisplay } from './components/expenses-display';
import { IncomesDisplay } from './components/incomes-display';
import { FinancingDisplay } from './components/financing-display';
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
        <GeneralInfoDisplay property={property} />
        <FinancingDisplay
          propertyId={property.id}
          propertyPrice={property.price}
          currentFinancing={property.financing}
        />
        <ExpensesDisplay
          propertyId={property.id}
          expenses={property.expenses}
        />
        <IncomesDisplay propertyId={property.id} incomes={property.incomes} />
      </div>
    </div>
  );
}
