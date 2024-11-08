-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
