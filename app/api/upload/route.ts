import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const propertyId = req.headers.get('property-id');

  if (!propertyId) {
    return NextResponse.json(
      { error: 'Property ID is required' },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File not found or incorrect format' },
        { status: 400 }
      );
    }

    // Define the file path in the public/uploads directory
    const fileName = file.name;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);

    // Ensure the uploads directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Write the file to the public/uploads directory
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Construct the image URL path relative to the public directory
    const imageUrl = `/uploads/${fileName}`;

    // Update the property record in the database with the image URL
    await prisma.property.update({
      where: { id: Number(propertyId) },
      data: { imageUrl }
    });

    revalidatePath('/properties/[id]', 'page');

    return NextResponse.json({ filePath: imageUrl });
  } catch (error) {
    console.error('Error handling file upload:', error);

    return NextResponse.json(
      { error: 'Failed to upload and save image' },
      { status: 500 }
    );
  }
}
