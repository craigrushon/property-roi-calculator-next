/*
  Warnings:

  - You are about to drop the column `additionalFees` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `currentBalance` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `downPayment` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `financingType` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `interestRate` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `loanTermYears` on the `Property` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FinancingType" AS ENUM ('MORTGAGE', 'HELOC', 'CASH');

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "additionalFees",
DROP COLUMN "currentBalance",
DROP COLUMN "downPayment",
DROP COLUMN "financingType",
DROP COLUMN "interestRate",
DROP COLUMN "loanTermYears";

-- CreateTable
CREATE TABLE "Financing" (
    "id" SERIAL NOT NULL,
    "type" "FinancingType" NOT NULL,
    "downPayment" INTEGER,
    "interestRate" DECIMAL(65,30),
    "loanTermYears" INTEGER,
    "additionalFees" INTEGER,
    "currentBalance" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "Financing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Financing_propertyId_key" ON "Financing"("propertyId");

-- AddForeignKey
ALTER TABLE "Financing" ADD CONSTRAINT "Financing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
