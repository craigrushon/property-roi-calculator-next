import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const properties = [
    {
      address: '123 Main Street',
      price: 250000,
      expenses: {
        create: [
          { name: 'property_taxes', amount: 3000.0, type: 'yearly' },
          { name: 'utilities', amount: 200.0, type: 'monthly' },
          { name: 'insurance', amount: 1500.0, type: 'yearly' }
        ]
      },
      incomes: {
        create: [
          { amount: 1200.0, type: 'monthly' },
          { amount: 500.0, type: 'monthly' }
        ]
      }
    },
    {
      address: '456 Elm Street',
      price: 300000,
      expenses: {
        create: [
          { name: 'property_taxes', amount: 3500.0, type: 'yearly' },
          { name: 'lawn_snow', amount: 100.0, type: 'monthly' },
          { name: 'maintenance', amount: 75.0, type: 'monthly' }
        ]
      },
      incomes: {
        create: [
          { amount: 1500.0, type: 'monthly' },
          { amount: 600.0, type: 'monthly' }
        ]
      }
    }
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
      include: {
        expenses: true,
        incomes: true
      }
    });
  }

  return new Response(
    JSON.stringify({
      message:
        'Successfully seeded database with properties, incomes, and expenses.'
    })
  );
}
