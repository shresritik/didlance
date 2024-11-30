"use client";

import React, { useState, useEffect } from "react";

import { useWallet } from "@suiet/wallet-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProposalCard, { Proposal } from "@/components/MyJob/ProposalCard";

// Keep your existing interfaces

const ProposalDetails = () => {
  const wallet = useWallet();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(
          `/api/proposals?freelancer_address=${wallet.address}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch proposals");
        }
        const data = await response.json();
        // Ensure data is treated as an array
        setProposals(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet.address) {
      fetchProposal();
    }
  }, [wallet.address]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-lg">Loading proposals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  const filteredProposals =
    activeTab === "all"
      ? proposals
      : proposals.filter(
          (proposal) => proposal.status.toLowerCase() === activeTab
        );

  const getProposalCount = (status: string) => {
    return status === "all"
      ? proposals.length
      : proposals.filter((p) => p.status.toLowerCase() === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Proposals</h1>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">
              All ({getProposalCount("all")})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({getProposalCount("draft")})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({getProposalCount("pending")})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({getProposalCount("accepted")})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({getProposalCount("rejected")})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredProposals.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No proposals found
              </div>
            ) : (
              filteredProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            )}
          </TabsContent>

          {["draft", "pending", "accepted", "rejected"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              {filteredProposals.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No {status} proposals found
                </div>
              ) : (
                filteredProposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ProposalDetails;
