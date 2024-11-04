import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';

interface Property {
  address: string;
  price: number;
  returnOnInvestment: number;
  cashflow: number;
  imageUrl: string;
}

export function PropertyRow({ item: property }: { item: Property }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt={`Image of ${property.address}`}
          className="aspect-square rounded-md object-cover"
          height={64}
          src={`/${property.imageUrl}`}
          width={64}
        />
      </TableCell>
      <TableCell className="font-medium">{property.address}</TableCell>
      <TableCell className="hidden md:table-cell">{`$${property.price.toLocaleString()}`}</TableCell>
      <TableCell>{`${property.returnOnInvestment.toFixed(2)}%`}</TableCell>
      <TableCell className="hidden md:table-cell">{`$${property.cashflow.toLocaleString()}`}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <button type="submit">Delete</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
