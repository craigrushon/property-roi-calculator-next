'use client';

import { TableHead } from '@/components/ui/table';
import { PaginatedTable } from './paginated-table';
import { PropertyRow } from './property-row';
import { Property } from 'models/types';

export function PropertiesTable({
  properties,
  offset
}: {
  properties: Property[];
  offset: number;
}) {
  return (
    <PaginatedTable
      title="Properties"
      description="View and manage your real estate properties and their ROI."
      items={properties}
      offset={offset}
      itemType="property"
      columns={
        <>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Return on Investment (%)</TableHead>
          <TableHead>Cashflow</TableHead>
        </>
      }
      rowComponent={PropertyRow}
    />
  );
}
