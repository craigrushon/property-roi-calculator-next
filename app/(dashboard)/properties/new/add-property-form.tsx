'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addProperty } from './actions';

export function AddPropertyForm() {
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState<number | string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !price) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await addProperty({ address, price: Number(price) });
      alert('Property added successfully!');
      // Reset form
      setAddress('');
      setPrice('');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the property.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium">
          Address
        </label>
        <Input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter property address"
          required
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium">
          Price ($)
        </label>
        <Input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter property price"
          required
        />
      </div>
      <Button type="submit">Add Property</Button>
    </form>
  );
}
