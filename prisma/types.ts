import { Decimal } from '@prisma/client/runtime/library';

export interface SelectProduct {
  status: 'active' | 'inactive' | 'archived';
  id: number;
  imageUrl: string;
  name: string;
  price: string;
  stock: number;
  availableAt: Date;
}
