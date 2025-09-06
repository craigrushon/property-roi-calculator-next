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
  let financingOption = undefined;
  if (property.financing) {
    const parameters: FinancingParameters = {
      propertyPrice: Number(property.price),
      downPayment: property.financing.downPayment || 0,
      interestRate: property.financing.interestRate
        ? Number(property.financing.interestRate)
        : 0,
      loanTermYears: property.financing.loanTermYears || 0,
      additionalFees: property.financing.additionalFees || 0,
      currentBalance: property.financing.currentBalance || undefined
    };

    financingOption = {
      type: property.financing.type as FinancingType,
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
    let financingOption = undefined;
    if (data.financing) {
      const parameters: FinancingParameters = {
        propertyPrice: Number(data.price),
        downPayment: data.financing.downPayment || 0,
        interestRate: data.financing.interestRate
          ? Number(data.financing.interestRate)
          : 0,
        loanTermYears: data.financing.loanTermYears || 0,
        additionalFees: data.financing.additionalFees || 0,
        currentBalance: data.financing.currentBalance || undefined
      };

      financingOption = {
        type: data.financing.type as FinancingType,
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
