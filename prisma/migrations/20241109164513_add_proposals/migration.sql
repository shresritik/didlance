-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BidType" AS ENUM ('FIXED', 'MILESTONE');

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "freelancer_address" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "bid_type" "BidType" NOT NULL DEFAULT 'FIXED',
    "total_bid" DECIMAL NOT NULL,
    "project_duration" TEXT NOT NULL,
    "cover_letter" TEXT NOT NULL,
    "is_boost" BOOLEAN NOT NULL DEFAULT false,
    "is_draft" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalAnswer" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "ProposalAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Proposal_freelancer_address_idx" ON "Proposal"("freelancer_address");

-- CreateIndex
CREATE INDEX "Proposal_jobId_idx" ON "Proposal"("jobId");

-- CreateIndex
CREATE INDEX "Milestone_proposalId_idx" ON "Milestone"("proposalId");

-- CreateIndex
CREATE INDEX "ProposalAnswer_proposalId_idx" ON "ProposalAnswer"("proposalId");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalAnswer" ADD CONSTRAINT "ProposalAnswer_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
