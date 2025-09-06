import prisma from 'lib/prisma';
import { Property } from 'models/property';
import { NormalizedExpense, NormalizedIncome } from 'models/types';
import { FinancingType, FinancingParameters } from 'models/financing/types';
import config from '../config';

// Create getProperty function
export async function getPropertyById(id: number) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      incomes: true,
      expenses: true
    }
  });

  if (!property) {
    return null;
  }

  const incomes: NormalizedIncome[] = property.incomes.map((income) => ({
    ...income,
    amount: Number(income.amount) // Convert Decimal to number
  }));

  const expenses: NormalizedExpense[] = property.expenses.map((expense) => ({
    ...expense,
    amount: Number(expense.amount) // Convert Decimal to number
  }));

  // Create financing option if financing data exists
  let financingOption = undefined;
  if (
    property.financingType &&
    property.downPayment !== null &&
    property.interestRate !== null &&
    property.loanTermYears !== null
  ) {
    const parameters: FinancingParameters = {
      propertyPrice: Number(property.price),
      downPayment: Number(property.downPayment),
      interestRate: Number(property.interestRate),
      loanTermYears: Number(property.loanTermYears),
      additionalFees: property.additionalFees
        ? Number(property.additionalFees)
        : 0,
      currentBalance: property.currentBalance
        ? Number(property.currentBalance)
        : undefined
    };

    financingOption = {
      type: property.financingType as FinancingType,
      parameters,
      result: {
        monthlyPayment: 0,
        totalInterest: 0,
        totalCost: 0,
        principalAmount: 0,
        downPayment: 0,
        additionalFees: 0
      } // Will be calculated by Property model
    };
  }

  return new Property(
    property.id,
    property.address,
    Number(property.price),
    property.imageUrl,
    incomes,
    expenses,
    financingOption
  ).toObject();
}

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
    const incomes: NormalizedIncome[] = data.incomes.map((income) => ({
      ...income,
      amount: Number(income.amount) // Convert Decimal to number
    }));

    const expenses: NormalizedExpense[] = data.expenses.map((expense) => ({
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

export async function updatePropertyFinancing(
  id: number,
  financingData: {
    financingType: string | null;
    downPayment: number | null;
    interestRate: number | null;
    loanTermYears: number | null;
    additionalFees: number | null;
    currentBalance: number | null;
  }
) {
  const updatedProperty = await prisma.property.update({
    where: { id },
    data: {
      financingType: financingData.financingType,
      downPayment: financingData.downPayment,
      interestRate: financingData.interestRate,
      loanTermYears: financingData.loanTermYears,
      additionalFees: financingData.additionalFees,
      currentBalance: financingData.currentBalance
    }
  });

  return updatedProperty;
}
