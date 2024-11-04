'use client';

import { TableHead } from '@/components/ui/table';
import { GenericTable } from '../table';
import { PropertyRow } from './property-row';

interface Property {
  address: string;
  price: number;
  returnOnInvestment: number;
  cashflow: number;
  imageUrl: string;
}

export function PropertiesTable({
  properties,
  offset,
  totalProperties
}: {
  properties: Property[];
  offset: number | null;
  totalProperties: number;
}) {
  return (
    <GenericTable
      title="Properties"
      description="View and manage your real estate properties and their ROI."
      items={properties}
      offset={offset}
      totalItems={totalProperties}
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
