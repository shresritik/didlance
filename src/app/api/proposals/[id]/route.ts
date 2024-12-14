import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IMilestone } from "@/types/proposal";
import { getStakingAmount } from "@/components/utils/utils";

// Get user specific proposals
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    const proposal = await prisma.proposal.findUnique({
      where: {
        id,
      },
      include: {
        milestones: true,
        job: true,
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = await params;
    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.bid_type === "MILESTONE" && {
          milestones: {
            upsert: data.milestones?.map((milestone: IMilestone) => ({
              where: { id: milestone.id || "new" },
              create: {
                description: milestone.description,
                amount: milestone.amount,
                due_date: milestone.due_date,
                status: milestone.status || "PENDING",
              },
              update: {
                description: milestone.description,
                amount: milestone.amount,
                due_date: milestone.due_date,
                status: milestone.status,
              },
            })),
          },
        }),
      },
      include: {
        job: true,
        answers: true,
        milestones: true,
      },
    });

    // Create notification for status update
    if (data.status) {
      await prisma.notification.create({
        data: {
          sui_address: proposal.sui_address,
          title: "Proposal Status Updated",
          message: `Your proposal status has been updated to ${data.status}`,
          type: "proposal_status_update",
          metadata: {
            proposalId: proposal.id,
            jobId: proposal.jobId,
            status: data.status,
          },
        },
      });
    }
    const stakingAmount = getStakingAmount(
      proposal.job.budget,
      proposal.job.min_stake
    );
    if (stakingAmount > 0) {
      const userData = await prisma.user.findFirst({
        where: {
          sui_address: data.sui_address,
        },
        include: {
          membership: true,
        },
      });
      if (+userData.membership.amount < stakingAmount) {
        throw new Error("Insufficient amount in membership to decrement.");
      }
      const membershipCommit = await prisma.membership.update({
        where: {
          id: userData.membershipId,
        },
        data: {
          amount: {
            decrement: stakingAmount,
          },
        },
      });
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First delete related records
    await prisma.proposalAnswer.deleteMany({
      where: { proposalId: params.id },
    });

    await prisma.milestone.deleteMany({
      where: { proposalId: params.id },
    });

    // Then delete the proposal
    const proposal = await prisma.proposal.delete({
      where: { id: params.id },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal" },
      { status: 500 }
    );
  }
}
