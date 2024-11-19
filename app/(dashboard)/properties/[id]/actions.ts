'use server';

import prisma from '@/lib/prisma';
import { Frequency } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function editExpense(formData: FormData) {
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const frequency = formData.get('frequency') as Frequency;

  // Validate input
  if (!id || !name || !amount || !frequency) {
    throw new Error('All fields are required.');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than 0.');
  }

  if (!['monthly', 'yearly'].includes(frequency)) {
    throw new Error('Frequency must be "monthly" or "yearly".');
  }

  // Update the expense in the database
  try {
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: { name, amount, frequency }
    });

    revalidatePath(`/properties/${updatedExpense.propertyId}`);

    return {
      id: updatedExpense.id,
      name: updatedExpense.name,
      amount: Number(updatedExpense.amount),
      frequency: updatedExpense.frequency
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update the expense. Please try again.');
  }
}

export async function deleteExpense(id: number) {
  if (!id) {
    throw new Error('Expense ID is required to delete an expense.');
  }

  try {
    await prisma.expense.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error('Failed to delete the expense. Please try again.');
  }
}
