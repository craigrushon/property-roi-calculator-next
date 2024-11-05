import prisma from 'lib/prisma';
import {
  Property,
  SimplifiedExpense,
  SimplifiedIncome
} from 'prisma/models/property';
import config from '../config';

export async function getProperties(
  search: string,
  offset: number
): Promise<{
  properties: ReturnType<Property['toObject']>[];
  itemsPerPage: number;
  totalProperties: number;
}> {
  const itemsPerPage = config.itemsPerPage;
  const propertiesData = await prisma.property.findMany({
    where: search
      ? {
          address: {
            contains: search,
            mode: 'insensitive' // case-insensitive search
          }
        }
      : undefined,
    take: itemsPerPage, // Equivalent to limit
    skip: offset || 0, // Skip based on offset
    include: {
      incomes: true,
      expenses: true
    }
  });

  const totalProperties = await prisma.property.count();

  // Map data to instances of the Property class
  const properties = propertiesData.map((data) => {
    const incomes: SimplifiedIncome[] = data.incomes.map((income) => ({
      ...income,
      amount: Number(income.amount) // Convert Decimal to number
    }));

    const expenses: SimplifiedExpense[] = data.expenses.map((expense) => ({
      ...expense,
      amount: Number(expense.amount) // Convert Decimal to number
    }));

    const property = new Property(
      data.id,
      data.address,
      Number(data.price),
      data.imageUrl,
      incomes,
      expenses
    );

    return property.toObject();
  });

  return {
    properties,
    itemsPerPage,
    totalProperties
  };
}

export async function deletePropertyById(id: number) {
  await prisma.property.delete({
    where: { id }
  });
}
