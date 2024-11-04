import prisma from 'lib/prisma';
import { SelectProduct } from 'prisma/types';

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive' // for case-insensitive search (similar to ilike in SQL)
        }
      },
      take: 1000 // Equivalent to limit(1000)
    });

    return {
      products: mapProducts(products),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  const totalProducts = await prisma.product.count();

  const moreProducts = await prisma.product.findMany({
    take: 5,
    skip: offset
  });

  const newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: mapProducts(moreProducts),
    newOffset,
    totalProducts
  };
}

export async function deleteProductById(id: number) {
  await prisma.product.delete({
    where: { id }
  });
}

// custom function to map products and convert price to formatted string
function mapProducts(products: any[]) {
  return products.map((product) => ({
    ...product,
    price: `${Number.parseFloat(product.price).toFixed(2)}`
  }));
}
