"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, ListChecks, FileText, Calendar } from 'lucide-react';
import { useWallet } from '@suiet/wallet-kit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Keep your existing interfaces
interface Milestone {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface Answer {
  id: string;
  question: string;
  answer: string;
}

interface Job {
  title: string;
  description: string;
  budget: number;
  project_length: string;
  skills: string[];
  status: string;
}

interface Proposal {
  id: string;
  freelancer_address: string;
  bid_type: 'FIXED' | 'MILESTONE';
  total_bid: number;
  project_duration: string;
  cover_letter: string;
  status: 'DRAFT' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  job: Job;
  milestones: Milestone[];
  answers: Answer[];
}

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="mb-6">
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
            <span>Bid: ${proposal.total_bid.toLocaleString()}</span>
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
          {proposal.job.skills.map(skill => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProposalDetails = () => {
  const wallet = useWallet();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`/api/proposals?freelancer_address=${wallet.address}`);
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }
        const data = await response.json();
        console.log("proposal data ", data);
        // Ensure data is treated as an array
        setProposals(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error:', err);
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

  const filteredProposals = activeTab === 'all'
    ? proposals
    : proposals.filter(proposal => proposal.status.toLowerCase() === activeTab);

  const getProposalCount = (status: string) => {
    return status === 'all'
      ? proposals.length
      : proposals.filter(p => p.status.toLowerCase() === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Proposals</h1>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">
              All ({getProposalCount('all')})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({getProposalCount('draft')})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({getProposalCount('pending')})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({getProposalCount('accepted')})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({getProposalCount('rejected')})
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

          {['draft', 'pending', 'accepted', 'rejected'].map((status) => (
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
