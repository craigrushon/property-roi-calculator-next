import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  updatePropertyFinancingAction,
  clearPropertyFinancingAction
} from './actions';
import {
  updatePropertyFinancing,
  clearPropertyFinancing
} from 'prisma/helpers/property';
import { FinancingType } from 'models/financing/types';

// Mock the property helpers
vi.mock('prisma/helpers/property', () => ({
  updatePropertyFinancing: vi.fn(),
  clearPropertyFinancing: vi.fn()
}));

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('Financing Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updatePropertyFinancingAction', () => {
    it('should create financing with MORTGAGE type', async () => {
      const formData = new FormData();
      formData.set('propertyId', '1');
      formData.set('financingType', FinancingType.MORTGAGE);
      formData.set('downPayment', '50000');
      formData.set('interestRate', '6.5');
      formData.set('loanTermYears', '30');
      formData.set('additionalFees', '2000');

      const mockUpdatePropertyFinancing = vi.mocked(updatePropertyFinancing);
      mockUpdatePropertyFinancing.mockResolvedValue({} as any);

      const result = await updatePropertyFinancingAction(formData);

      expect(result).toEqual({ success: true });
      expect(mockUpdatePropertyFinancing).toHaveBeenCalledWith(1, {
        financingType: FinancingType.MORTGAGE,
        downPayment: 50000,
        interestRate: 6.5,
        loanTermYears: 30,
        additionalFees: 2000,
        currentBalance: null
      });
    });

    it('should create financing with HELOC type including currentBalance', async () => {
      const formData = new FormData();
      formData.set('propertyId', '1');
      formData.set('financingType', FinancingType.HELOC);
      formData.set('downPayment', '30000');
      formData.set('interestRate', '7.0');
      formData.set('loanTermYears', '15');
      formData.set('additionalFees', '1000');
      formData.set('currentBalance', '150000');

      const mockUpdatePropertyFinancing = vi.mocked(updatePropertyFinancing);
      mockUpdatePropertyFinancing.mockResolvedValue({} as any);

      const result = await updatePropertyFinancingAction(formData);

      expect(result).toEqual({ success: true });
      expect(mockUpdatePropertyFinancing).toHaveBeenCalledWith(1, {
        financingType: FinancingType.HELOC,
        downPayment: 30000,
        interestRate: 7.0,
        loanTermYears: 15,
        additionalFees: 1000,
        currentBalance: 150000
      });
    });

    it('should create financing with CASH type', async () => {
      const formData = new FormData();
      formData.set('propertyId', '1');
      formData.set('financingType', FinancingType.CASH);
      formData.set('additionalFees', '5000');

      const mockUpdatePropertyFinancing = vi.mocked(updatePropertyFinancing);
      mockUpdatePropertyFinancing.mockResolvedValue({} as any);

      const result = await updatePropertyFinancingAction(formData);

      expect(result).toEqual({ success: true });
      expect(mockUpdatePropertyFinancing).toHaveBeenCalledWith(1, {
        financingType: FinancingType.CASH,
        downPayment: null,
        interestRate: null,
        loanTermYears: null,
        additionalFees: 5000,
        currentBalance: null
      });
    });

    it('should handle missing propertyId', async () => {
      const formData = new FormData();
      formData.set('financingType', FinancingType.MORTGAGE);

      await expect(updatePropertyFinancingAction(formData)).rejects.toThrow(
        'Property ID is required.'
      );
    });

    it('should validate required fields for MORTGAGE', async () => {
      const formData = new FormData();
      formData.set('propertyId', '1');
      formData.set('financingType', FinancingType.MORTGAGE);
      // Missing required fields

      await expect(updatePropertyFinancingAction(formData)).rejects.toThrow(
        'Down payment must be greater than or equal to 0.'
      );
    });

    it('should validate required fields for HELOC', async () => {
      const formData = new FormData();
      formData.set('propertyId', '1');
      formData.set('financingType', FinancingType.HELOC);
      formData.set('downPayment', '30000');
      // Missing interestRate and loanTermYears

      await expect(updatePropertyFinancingAction(formData)).rejects.toThrow(
        'Interest rate must be greater than or equal to 0.'
      );
    });

    it('should handle invalid financing type', async () => {
      const formData = new FormData();
      formData.set('propertyId', '1');
      formData.set('financingType', 'invalid_type');

      await expect(updatePropertyFinancingAction(formData)).rejects.toThrow(
        'Invalid financing type.'
      );
    });

    it('should handle database errors', async () => {
      const formData = new FormData();
      formData.set('propertyId', '1');
      formData.set('financingType', FinancingType.MORTGAGE);
      formData.set('downPayment', '50000');
      formData.set('interestRate', '6.5');
      formData.set('loanTermYears', '30');
      formData.set('additionalFees', '2000');

      const mockUpdatePropertyFinancing = vi.mocked(updatePropertyFinancing);
      mockUpdatePropertyFinancing.mockRejectedValue(
        new Error('Database error')
      );

      await expect(updatePropertyFinancingAction(formData)).rejects.toThrow(
        'Failed to update property financing. Please try again.'
      );
    });
  });

  describe('clearPropertyFinancingAction', () => {
    it('should clear financing for valid propertyId', async () => {
      const mockClearPropertyFinancing = vi.mocked(clearPropertyFinancing);
      mockClearPropertyFinancing.mockResolvedValue({} as any);

      const result = await clearPropertyFinancingAction(1);

      expect(result).toEqual({ success: true });
      expect(mockClearPropertyFinancing).toHaveBeenCalledWith(1);
    });

    it('should handle missing propertyId', async () => {
      await expect(clearPropertyFinancingAction(0)).rejects.toThrow(
        'Property ID is required.'
      );
    });

    it('should handle database errors', async () => {
      const mockClearPropertyFinancing = vi.mocked(clearPropertyFinancing);
      mockClearPropertyFinancing.mockRejectedValue(new Error('Database error'));

      await expect(clearPropertyFinancingAction(1)).rejects.toThrow(
        'Failed to clear property financing. Please try again.'
      );
    });
  });
});
