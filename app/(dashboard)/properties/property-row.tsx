import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { HousePlus, MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Property } from 'models/types';
import { deleteProperty } from './actions';

export function PropertyRow({ item: property }: { item: Property }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        {property.imageUrl ? (
          <Image
            alt={`Image of ${property.address}`}
            className="aspect-square rounded-md object-cover"
            height={64}
            src={`${property.imageUrl}`}
            width={64}
          />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/properties/${property.id}`}>
                <div className="bg-gray-100 h-16 w-16 rounded-md text-center">
                  <HousePlus className="h-16 w-16 p-5 rounded-md text-center opacity-50" />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Add an image</TooltipContent>
          </Tooltip>
        )}
      </TableCell>
      <TableCell className="font-medium">
        <Link className="hover:underline" href={`/properties/${property.id}`}>
          {property.address}
        </Link>
      </TableCell>
      <TableCell className="hidden md:table-cell">{`$${property.price.toLocaleString()}`}</TableCell>
      <TableCell>{`${property.returnOnInvestment.toFixed(2)}%`}</TableCell>
      <TableCell className="hidden md:table-cell">{`$${property.cashflow.toFixed(2)}`}</TableCell>
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
            <DropdownMenuItem>
              <Link href={`/properties/${property.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button type="submit" onClick={() => deleteProperty(property.id)}>
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
