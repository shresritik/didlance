/*
  Warnings:

  - A unique constraint covering the columns `[userId,jobId]` on the table `Proposal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `job_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Proposal_freelancer_address_idx";

-- DropIndex
DROP INDEX "Proposal_freelancer_address_jobId_key";

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "job_details" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "sui_address" TEXT NOT NULL,
    "commit" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_sui_address_key" ON "User"("sui_address");

-- CreateIndex
CREATE INDEX "Proposal_userId_idx" ON "Proposal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_userId_jobId_key" ON "Proposal"("userId", "jobId");

-- AddForeignKey
ALTER TABLE "job_details" ADD CONSTRAINT "job_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
