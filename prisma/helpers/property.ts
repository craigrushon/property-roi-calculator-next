import prisma from 'lib/prisma';
import {
  Property,
  SimplifiedExpense,
  SimplifiedIncome
} from 'prisma/models/property';

export async function getProperties(
  search: string,
  offset: number
): Promise<{
  properties: ReturnType<Property['toObject']>[];
  newOffset: number | null;
  totalProperties: number;
}> {
  const propertiesData = await prisma.property.findMany({
    where: search
      ? {
          address: {
            contains: search,
            mode: 'insensitive' // case-insensitive search
          }
        }
      : undefined,
    take: 5, // Adjust as needed for pagination
    skip: offset || 0, // Skip based on offset
    include: {
      incomes: true,
      expenses: true
    }
  });

  const totalProperties = await prisma.property.count(); // count total properties
  const newOffset = propertiesData.length >= 5 ? offset + 5 : null; // Adjust pagination as needed

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
      incomes,
      expenses
    );

    return property.toObject();
  });

  return {
    properties,
    newOffset,
    totalProperties
  };
}

export async function deletePropertyById(id: number) {
  await prisma.property.delete({
    where: { id }
  });
}
