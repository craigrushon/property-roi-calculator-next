// src/actions/propertyActions.ts
'use server';

import prisma from 'lib/prisma';

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
