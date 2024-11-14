'use client';

import React, { ReactNode } from 'react';
import { TableRow, TableHeader, TableBody, Table } from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { pluralize } from '@/lib/utils';
import { usePagination } from 'hooks/usePagination';

interface PaginatedTableProps<T> {
  title: string;
  description: string;
  items: T[];
  offset: number;
  totalItems: number;
  columns: ReactNode;
  rowComponent: React.ComponentType<{ item: T }>;
  itemType: string; // e.g., 'product' or 'property'
  itemsPerPage?: number;
}

export function PaginatedTable<T>({
  title,
  description,
  items,
  totalItems,
  offset,
  columns,
  rowComponent: RowComponent,
  itemType,
  itemsPerPage = 5
}: PaginatedTableProps<T>) {
  const path = usePathname();

  const { nextPage, prevPage, start, end } = usePagination(
    path,
    offset,
    itemsPerPage,
    totalItems
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {items.length === 0
            ? `There are no ${itemType}s to display. Please try adjusting your search or adding new ${itemType}s.`
            : description}
        </CardDescription>
      </CardHeader>
      {items.length > 0 && (
        <>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>{columns}</TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <RowComponent key={index} item={item} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <form className="flex items-center w-full justify-between">
              <div className="text-xs text-muted-foreground">
                Showing{' '}
                <span className="font-bold">
                  {start}-{end}
                </span>{' '}
                of <strong>{totalItems}</strong>{' '}
                {pluralize(itemType, totalItems)}
              </div>
              <div className="flex">
                <Button
                  formAction={prevPage}
                  variant="ghost"
                  size="sm"
                  type="submit"
                  disabled={start === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Prev
                </Button>
                <Button
                  formAction={nextPage}
                  variant="ghost"
                  size="sm"
                  type="submit"
                  disabled={end === totalItems}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
