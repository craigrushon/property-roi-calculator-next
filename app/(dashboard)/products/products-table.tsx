'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import { GenericTable } from '../table';
import { Product } from './product';
import { SelectProduct } from 'prisma/types';

export function ProductsTable({
  products,
  offset,
  totalProducts
}: {
  products: SelectProduct[];
  offset: number | null;
  totalProducts: number;
}) {
  return (
    <GenericTable
      title="Products"
      description="Manage your products and view their sales performance."
      items={products}
      offset={offset}
      totalItems={totalProducts}
      itemType="product"
      columns={
        <>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Price</TableHead>
          <TableHead className="hidden md:table-cell">Total Sales</TableHead>
          <TableHead className="hidden md:table-cell">Created at</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </>
      }
      rowComponent={Product}
    />
  );
}
