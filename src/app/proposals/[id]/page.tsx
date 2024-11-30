"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getStatusColor, queryClient } from "@/lib/utils";
import {
  job_details,
  Milestone,
  Proposal,
  ProposalAnswer,
} from "@prisma/client";
import { Label, RadioGroup } from "@radix-ui/react-dropdown-menu";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Switch } from "@radix-ui/react-switch";
import { useWallet } from "@suiet/wallet-kit";
import { useMutation } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type TProposal = Proposal & {
  job: job_details;
  milestone: Milestone;
  answers: ProposalAnswer[];
};

const UserProposal = () => {
  const wallet = useWallet();
  const [proposal, setProposal] = useState<TProposal | null>(null);
  const params = useParams<Record<string, string>>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const actions = ["PENDING", "ACCEPTED", "REJECTED", "DRAFT"];
  useEffect(() => {
    const fetchProposalById = async (id: string) => {
      setIsLoading(true);

      const data = await fetch("/api/proposals/" + id);
      setProposal(await data.json());
      setIsLoading(false);
    };
    fetchProposalById(params.id);
  }, [params.id]);

  const updateData = async (payload) => {
    try {
      const response = await fetch("/api/proposals/" + proposal.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Ensure payload is not null
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Updated resource:", result);
      return result;
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  const { mutate } = useMutation({
    mutationFn: (payload: Payload) => updateData(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["job"] }),
  });
  interface Payload {
    sui_address: string;
    status: string;
    total_bid?: number;
  }
  const handleAction = (action: string) => {
    let payload: Payload = {
      sui_address: proposal.sui_address,
      status: action,
    };
    const bid = Number(proposal.total_bid);
    if (bid > 0 && action === "ACCEPTED") {
      payload = { ...payload, total_bid: bid };
    }
    mutate(payload);
    router.push("/jobs/" + proposal.job.id);
  };
  if (isLoading || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Proposal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bid Type Selection */}
        <div className="space-y-4">
          <Label>How do you want to be paid?</Label>
          {proposal?.bid_type === "FIXED" ? (
            <div className="flex items-center space-x-2">
              <p>By project (fixed price)</p>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <p>By milestone</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium">Escrow</h4>
          </div>
        </div>

        {/* Bid Amount */}

        <div className={`space-y-4 p-4 `}>
          <Label>Stake Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              disabled={true}
              type="number"
              placeholder="Enter your stake amount"
              value={proposal?.total_bid as unknown as string}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Cover Letter</Label>
          <Textarea
            defaultValue={proposal?.cover_letter}
            className={`min-h-[200px]  bg-white
          `}
          />
        </div>

        {/* Project Duration */}
        <div className="space-y-2">
          <Label>How long will this project take?</Label>
          <p>{proposal?.job.project_length}</p>
        </div>

        {/* Additional Questions */}
        {/* {proposal.questions && (
          <div className="space-y-4">
            <h3 className="font-medium">Additional Questions</h3>
            {job.questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label>
                  {question}
                  {}
                </Label>
                <Textarea
                  placeholder="Type your answer..."
                  value={answers[index] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [index]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        )} */}
      </CardContent>
      {wallet.address === proposal.job.sui_address && (
        <div className="flex justify-center items-center space-x-3 p-5">
          {actions.map((action, i) => (
            <Badge
              key={i}
              onClick={() => handleAction(action)}
              className={getStatusColor(action)}
            >
              {action}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
};

export default UserProposal;
