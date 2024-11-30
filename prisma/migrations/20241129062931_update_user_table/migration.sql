/*
  Warnings:

  - You are about to drop the column `freelancer_address` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Proposal` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `job_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sui_address,jobId]` on the table `Proposal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Proposal" DROP CONSTRAINT "Proposal_userId_fkey";

-- DropForeignKey
ALTER TABLE "job_details" DROP CONSTRAINT "job_details_userId_fkey";

-- DropIndex
DROP INDEX "Proposal_userId_idx";

-- DropIndex
DROP INDEX "Proposal_userId_jobId_key";

-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "freelancer_address",
DROP COLUMN "userId",
ADD COLUMN     "sui_address" TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("sui_address");

-- AlterTable
ALTER TABLE "job_details" DROP COLUMN "userId",
ADD COLUMN     "min_stake" INTEGER DEFAULT 0,
ALTER COLUMN "sui_address" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Proposal_sui_address_idx" ON "Proposal"("sui_address");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_sui_address_jobId_key" ON "Proposal"("sui_address", "jobId");

-- AddForeignKey
ALTER TABLE "job_details" ADD CONSTRAINT "job_details_sui_address_fkey" FOREIGN KEY ("sui_address") REFERENCES "User"("sui_address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_sui_address_fkey" FOREIGN KEY ("sui_address") REFERENCES "User"("sui_address") ON DELETE SET NULL ON UPDATE CASCADE;
