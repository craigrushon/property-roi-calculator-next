'use server';

import prisma from 'lib/prisma';
import { Expense, Income } from './property-onboarding';

export async function addPropertyWithDetails(propertyData: {
  address: string;
  price: number;
  incomes: Income[];
  expenses: Expense[];
}) {
  const { address, price, incomes, expenses } = propertyData;

  if (!address || !price) {
    throw new Error('Address and price are required');
  }

  try {
    const newProperty = await prisma.property.create({
      data: {
        address,
        price,
        incomes: {
          create: incomes
        },
        expenses: {
          create: expenses
        }
      }
    });
    return newProperty;
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
}

export async function addProperty(propertyData: {
  address: string;
  price: number;
}) {
  const { address, price } = propertyData;

  if (!address || !price) {
    throw new Error('Address and price are required');
  }

  try {
    const newProperty = await prisma.property.create({
      data: {
        address,
        price: Number(price)
      }
    });
    return newProperty;
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
}
