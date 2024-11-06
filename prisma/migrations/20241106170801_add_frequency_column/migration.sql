-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('monthly', 'yearly');

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "frequency" "Frequency" NOT NULL DEFAULT 'monthly';
