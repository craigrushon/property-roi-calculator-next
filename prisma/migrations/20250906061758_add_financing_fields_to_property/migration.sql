-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "additionalFees" INTEGER,
ADD COLUMN     "currentBalance" INTEGER,
ADD COLUMN     "downPayment" INTEGER,
ADD COLUMN     "financingType" TEXT,
ADD COLUMN     "interestRate" DECIMAL(65,30),
ADD COLUMN     "loanTermYears" INTEGER;
