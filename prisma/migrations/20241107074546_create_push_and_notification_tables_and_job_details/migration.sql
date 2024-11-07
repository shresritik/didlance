-- CreateTable
CREATE TABLE "job_details" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "long_description" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "time_posted" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "expertise" TEXT NOT NULL,
    "proposals" INTEGER NOT NULL,
    "client_rating" DECIMAL NOT NULL,
    "client_location" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "project_length" TEXT NOT NULL,
    "weekly_hours" TEXT,
    "skills" TEXT[],
    "activity_on" TEXT NOT NULL,
    "client_history" JSONB NOT NULL,
    "attachments" TEXT[],
    "questions" TEXT[],

    CONSTRAINT "job_details_pkey" PRIMARY KEY ("id")
);
