"use client";
import { DollarSign, Clock, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getStatusColor } from "@/lib/utils";
import { getStakingAmount } from "../utils/utils";

export interface Milestone {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface Answer {
  id: string;
  question: string;
  answer: string;
}

export interface Job {
  title: string;
  description: string;
  budget: number;
  project_length: string;
  skills: string[];
  status: string;
  min_stake?: string;
}

export interface Proposal {
  id: string;
  sui_address?: string;
  bid_type: "FIXED" | "MILESTONE";
  total_bid: number;
  project_duration: string;
  cover_letter: string;
  status: "DRAFT" | "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  job: Job;
  milestones: Milestone[];
  answers: Answer[];
}

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  const router = useRouter();
  console.log(proposal);
  return (
    <Card
      onClick={() => router.push(`/proposals/${proposal.id}`)}
      className="mb-6 cursor-pointer"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{proposal.job.title}</CardTitle>
            <CardDescription className="mt-2">
              {proposal.job.description.substring(0, 150)}...
            </CardDescription>
          </div>
          <Badge className={getStatusColor(proposal.status)}>
            {proposal.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>
              Stake: $
              {getStakingAmount(proposal.job.budget, proposal.job.min_stake)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{proposal.project_duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>Budget: ${proposal.job.budget.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {proposal.job.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
