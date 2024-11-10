/*
  Warnings:

  - A unique constraint covering the columns `[freelancer_address,jobId]` on the table `Proposal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Proposal_freelancer_address_key";

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_freelancer_address_jobId_key" ON "Proposal"("freelancer_address", "jobId");
