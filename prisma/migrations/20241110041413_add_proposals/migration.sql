/*
  Warnings:

  - A unique constraint covering the columns `[freelancer_address]` on the table `Proposal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Proposal_freelancer_address_key" ON "Proposal"("freelancer_address");
