import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IProposal } from "@/types/proposal";
import jobDetailsDB from "@/lib/db/job-details";

export async function POST(request: Request) {
  try {
    const data: IProposal = await request.json();
    console.log("Received proposal data: ", data);

    // Debug log
    const jobExists = await jobDetailsDB.getJob(data.jobId);

    console.log("Found job:", jobExists); // Add this to see if job exists

    const result = await prisma.proposal.create({
      data: {
        freelancer_address: data.freelancer_address.toLowerCase(),
        job: {
          connect: { id: data.jobId },
        },
        bid_type: data.bid_type,
        total_bid: data.total_bid,
        project_duration: data.project_duration,
        cover_letter: data.cover_letter,
        is_boost: data.is_boost,
        is_draft: data.is_draft,
        status: data.is_draft ? "DRAFT" : "PENDING",
        user: {
          connect: {
            id: data.userId, // Ensure data.userId is defined and valid
            sui_address: data.freelancer_address.toLowerCase(),
          },
        },
        answers: {
          createMany: {
            data: data.answers.map((answer) => ({
              question: answer.question,
              answer: answer.answer,
            })),
          },
        },
      },
    });

    console.log("Created proposal:", result); // Add this to see created proposal

    //   // Create notification
    //   const notification = await tx.notification.create({
    //     data: {
    //       sui_address: data.freelancer_address.toLowerCase(),
    //       title: "New Proposal Received",
    //       message: `You have received a new proposal for job: ${data.jobId}`,
    //       type: "new_proposal",
    //       metadata: {
    //         jobId: data.jobId,
    //         proposalId: result.id,
    //       },
    //     },
    //   });

    //   console.log("Created notification:", notification); // Add this to see created notification

    //   return { result, notification };
    // });

    return NextResponse.json(result);
  } catch (error) {
    // Enhanced error logging
    console.error("Detailed error:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });

    if (error instanceof Error) {
      // Check for specific Prisma errors
      if (error.message.includes("Foreign key constraint failed")) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      // Check for validation errors
      if (error.message.includes("Invalid")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}

// GET all proposals for a job
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const freelancerAddress = searchParams.get("freelancer_address");

    if (!jobId && !freelancerAddress) {
      return NextResponse.json(
        { error: "Either jobId or freelancer_address is required" },
        { status: 400 }
      );
    }

    const proposals = await prisma.proposal.findMany({
      where: {
        ...(jobId && { jobId }),
        ...(freelancerAddress && { freelancer_address: freelancerAddress }),
      },
      select: {
        id: true,
        bid_type: true,
        total_bid: true,
        project_duration: true,
        cover_letter: true,
        status: true,
        createdAt: true,
        answers: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
        milestones: {
          select: {
            id: true,
            description: true,
            amount: true,
            due_date: true,
            status: true,
          },
        },
        job: {
          select: {
            title: true,
            description: true,
            budget: true,
            project_length: true,
            skills: true,
            job_status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposals" },
      { status: 500 }
    );
  }
}
