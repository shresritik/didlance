/*
  Warnings:

  - The `proposals` column on the `job_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "job_details" ADD COLUMN     "job_status" "JobStatus" NOT NULL DEFAULT 'OPEN',
DROP COLUMN "proposals",
ADD COLUMN     "proposals" TEXT[];
