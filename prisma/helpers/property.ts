import prisma from 'lib/prisma';
import { Property } from 'models/property';
import { NormalizedExpense, NormalizedIncome } from 'models/types';
import {
  FinancingType,
  FinancingParameters,
  FinancingOption
} from 'models/financing/types';
import { FinancingFactory } from 'models/financing';
import config from '../config';

/**
 * Helper function to create a financing option from database financing data
 */
function createFinancingOption(
  financingData: any,
  propertyPrice: number
): FinancingOption | undefined {
  if (!financingData) return undefined;

  const parameters: FinancingParameters = {
    propertyPrice,
    downPayment: financingData.downPayment || 0,
    interestRate: financingData.interestRate
      ? Number(financingData.interestRate)
      : 0,
    loanTermYears: financingData.loanTermYears || 0,
    additionalFees: financingData.additionalFees || 0,
    currentBalance: financingData.currentBalance || undefined
  };

  // Calculate the actual financing result using the calculator
  const calculator = FinancingFactory.createCalculator(
    financingData.type as FinancingType
  );
  const result = calculator.calculate(parameters);

  return {
    type: financingData.type as FinancingType,
    parameters,
    result
  };
}

// Create getProperty function
export async function getPropertyById(id: number) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      incomes: true,
      expenses: true,
      financing: true
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
  const financingOption = createFinancingOption(
    property.financing,
    Number(property.price)
  );

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
      expenses: true,
      financing: true
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

    // Create financing option if financing data exists
    const financingOption = createFinancingOption(
      data.financing,
      Number(data.price)
    );

    const property = new Property(
      data.id,
      data.address,
      Number(data.price),
      data.imageUrl,
      incomes,
      expenses,
      financingOption
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
    financingType: FinancingType;
    downPayment: number | null;
    interestRate: number | null;
    loanTermYears: number | null;
    additionalFees: number | null;
    currentBalance: number | null;
  }
) {
  // Check if financing already exists for this property
  const existingFinancing = await prisma.financing.findUnique({
    where: { propertyId: id }
  });

  if (existingFinancing) {
    // Update existing financing
    const updatedFinancing = await prisma.financing.update({
      where: { propertyId: id },
      data: {
        type: financingData.financingType,
        downPayment: financingData.downPayment,
        interestRate: financingData.interestRate,
        loanTermYears: financingData.loanTermYears,
        additionalFees: financingData.additionalFees,
        currentBalance: financingData.currentBalance
      }
    });
    return updatedFinancing;
  } else if (financingData.financingType) {
    // Create new financing
    const newFinancing = await prisma.financing.create({
      data: {
        type: financingData.financingType,
        downPayment: financingData.downPayment,
        interestRate: financingData.interestRate,
        loanTermYears: financingData.loanTermYears,
        additionalFees: financingData.additionalFees,
        currentBalance: financingData.currentBalance,
        propertyId: id
      }
    });
    return newFinancing;
  }

  return null;
}

export async function clearPropertyFinancing(id: number) {
  // Delete financing if it exists
  const deletedFinancing = await prisma.financing.deleteMany({
    where: { propertyId: id }
  });

  return deletedFinancing;
}
