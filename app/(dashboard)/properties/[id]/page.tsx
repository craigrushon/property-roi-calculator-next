import { notFound } from 'next/navigation';
import { ExpensesDisplay } from './components/expenses-display';
import { IncomesDisplay } from './components/incomes-display';
import { FinancingDisplay } from './components/financing-display';
import PropertyHero from './components/property-hero';
import { getPropertyById } from 'prisma/helpers/property';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { Edit } from 'lucide-react';
import Link from 'next/link';

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{property.address}</h1>
          <Badge
            variant={property.cashflow > 0 ? 'default' : 'destructive'}
            className={
              property.cashflow > 0
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : ''
            }
          >
            {property.cashflow > 0 ? 'Profitable' : 'Loss-making'}
          </Badge>
        </div>
        <Link href={`/properties/${property.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Button>
        </Link>
      </div>

      <PropertyHero property={property} />
      <FinancingDisplay
        propertyId={property.id}
        propertyPrice={property.price}
        currentFinancing={property.financing}
      />
      <IncomesDisplay propertyId={property.id} incomes={property.incomes} />
      <ExpensesDisplay propertyId={property.id} expenses={property.expenses} />
    </div>
  );
}
