'use server';

import prisma from '@/lib/prisma';
import { Frequency } from '@prisma/client';
import { ValidationError } from 'models/validation-error';
import { revalidatePath } from 'next/cache';

export async function createExpense(formData: FormData) {
  const propertyId = Number(formData.get('propertyId'));
  const name = formData.get('name') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const frequency = formData.get('frequency') as Frequency;

  if (!propertyId || !name || !frequency) {
    throw new ValidationError('All fields are required.');
  }

  if (!['monthly', 'yearly'].includes(frequency)) {
    throw new Error('Frequency must be "monthly" or "yearly".');
  }

  try {
    const newExpense = await prisma.expense.create({
      data: {
        propertyId,
        name,
        amount,
        frequency
      }
    });

    revalidatePath('/properties/[id]', 'page');

    return {
      id: newExpense.id,
      name: newExpense.name,
      amount: Number(newExpense.amount),
      frequency: newExpense.frequency
    };
  } catch (e) {
    if (e instanceof ValidationError) {
      throw e;
    }
    console.error('Error creating expense:', e);
    throw new Error('Failed to create the expense. Please try again.');
  }
}

export async function updateExpense(formData: FormData) {
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const frequency = formData.get('frequency') as Frequency;

  // Validate input
  if (!id || !name || !amount || !frequency) {
    throw new Error('All fields are required.');
  }

  if (amount <= 0) {
    throw new ValidationError('Amount must be greater than 0.');
  }

  if (!['monthly', 'yearly'].includes(frequency)) {
    throw new ValidationError('Frequency must be "monthly" or "yearly".');
  }

  // Update the expense in the database
  try {
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: { name, amount, frequency }
    });

    revalidatePath('/properties/[id]', 'page');

    return {
      id: updatedExpense.id,
      name: updatedExpense.name,
      amount: Number(updatedExpense.amount),
      frequency: updatedExpense.frequency
    };
  } catch (e) {
    if (e instanceof ValidationError) {
      throw e;
    }
    console.error('Error updating expense:', e);
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

    revalidatePath('/properties/[id]/edit', 'page');
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error('Failed to delete the expense. Please try again.');
  }
}

export async function createIncome(formData: FormData) {
  const propertyId = Number(formData.get('propertyId'));
  const amount = parseFloat(formData.get('amount') as string);
  const frequency = formData.get('frequency') as Frequency;

  if (!propertyId || !frequency || isNaN(amount)) {
    throw new ValidationError('All fields are required.');
  }

  if (amount <= 0) {
    throw new ValidationError('Amount must be greater than 0.');
  }

  if (!['monthly', 'yearly'].includes(frequency)) {
    throw new ValidationError('Frequency must be "monthly" or "yearly".');
  }

  try {
    const newIncome = await prisma.income.create({
      data: {
        propertyId,
        amount,
        frequency
      }
    });

    revalidatePath('/properties/[id]', 'page');

    return {
      id: newIncome.id,
      amount: Number(newIncome.amount),
      frequency: newIncome.frequency
    };
  } catch (e) {
    if (e instanceof ValidationError) {
      throw e;
    }
    console.error('Error creating income:', e);
    throw new Error('Failed to create the income. Please try again.');
  }
}

// Function to update an income
export async function updateIncome(formData: FormData) {
  const id = Number(formData.get('id'));
  const amount = parseFloat(formData.get('amount') as string);
  const frequency = formData.get('frequency') as Frequency;

  // Validate input
  if (!id || isNaN(amount) || !frequency) {
    throw new ValidationError('All fields are required.');
  }

  if (amount <= 0) {
    throw new ValidationError('Amount must be greater than 0.');
  }

  if (!['monthly', 'yearly'].includes(frequency)) {
    throw new ValidationError('Frequency must be "monthly" or "yearly".');
  }

  try {
    const updatedIncome = await prisma.income.update({
      where: { id },
      data: { amount, frequency }
    });

    revalidatePath('/properties/[id]', 'page');

    return {
      id: updatedIncome.id,
      amount: Number(updatedIncome.amount),
      frequency: updatedIncome.frequency
    };
  } catch (e) {
    if (e instanceof ValidationError) {
      throw e;
    }
    console.error('Error updating income:', e);
    throw new Error('Failed to update the income. Please try again.');
  }
}

// Function to delete an income
export async function deleteIncome(id: number) {
  if (!id) {
    throw new Error('Income ID is required to delete an income.');
  }

  try {
    await prisma.income.delete({
      where: { id }
    });

    revalidatePath('/properties/[id]/edit', 'page');
  } catch (error) {
    console.error('Error deleting income:', error);
    throw new Error('Failed to delete the income. Please try again.');
  }
}
