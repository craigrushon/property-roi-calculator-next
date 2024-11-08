'use server';

import prisma from 'lib/prisma';
import { Frequency } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { permanentRedirect } from 'next/navigation';

export interface Income {
  amount: number;
  frequency: Frequency;
}

export interface Expense {
  amount: number;
  frequency: Frequency;
  name: string;
}

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

    revalidatePath('/');
    permanentRedirect(`/properties/${newProperty.id}`);
  } catch (error: any) {
    if (error.message == 'NEXT_REDIRECT') {
      throw error;
    }

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

export async function deleteProperty(propertyId: number) {
  try {
    await prisma.property.delete({
      where: { id: propertyId }
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
}
