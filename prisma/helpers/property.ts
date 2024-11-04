import prisma from 'lib/prisma';

export interface Property {
  id: number;
  address: string;
  price: number;
  returnOnInvestment: number;
  cashflow: number;
  imageUrl: string;
}

export async function getProperties(
  search: string,
  offset: number
): Promise<{
  properties: Property[];
  newOffset: number | null;
  totalProperties: number;
}> {
  if (search) {
    const properties = await prisma.property.findMany({
      where: {
        address: {
          contains: search,
          mode: 'insensitive' // case-insensitive search
        }
      },
      take: 1000 // limit the number of results to 1000
    });

    return {
      properties: mapProperties(properties),
      newOffset: null,
      totalProperties: 0
    };
  }

  if (offset === null) {
    return { properties: [], newOffset: null, totalProperties: 0 };
  }

  const totalProperties = await prisma.property.count(); // count total properties

  const moreProperties = await prisma.property.findMany({
    take: 5, // limit to 5 results per page
    skip: offset // skip offset number of properties
  });

  const newOffset = moreProperties.length >= 5 ? offset + 5 : null;

  return {
    properties: mapProperties(moreProperties),
    newOffset,
    totalProperties
  };
}

export async function deletePropertyById(id: number) {
  await prisma.property.delete({
    where: { id }
  });
}

// Helper function to map properties and format numeric fields
function mapProperties(properties: any[]) {
  return properties.map((property) => ({
    ...property,
    imageUrl: `${property.address.split(' ').join('-').toLowerCase()}.jpg`, // generating image URL from address
    price: Number.parseFloat(property.price).toFixed(2), // formatting price as a string with 2 decimal places
    returnOnInvestment: 0.14, // property.returnOnInvestment.toFixed(2), // formatting ROI
    cashflow: 1500.0 // Number.parseFloat(property.cashflow).toFixed(2) // formatting cashflow
  }));
}
