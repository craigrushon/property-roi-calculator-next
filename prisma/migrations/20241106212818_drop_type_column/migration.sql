/*
  Warnings:

  - You are about to drop the column `type` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Income` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "type";
