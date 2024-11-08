"use client"
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, MapPin, Star, Briefcase, Users } from 'lucide-react';
import { useWallet } from '@suiet/wallet-kit';

// Define types
type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface ClientHistory {
  jobsPosted: number;
  hireRate: number;
}

interface JobDetails {
  id: string;
  title: string;
  description: string;
  job_status: JobStatus;
  budget: number;
  project_length: string;
  client_location: string;
  client_rating: number;
  skills: string[];
  client_history: ClientHistory;
  time_posted: string;
}

interface StatusColorMap {
  [key: string]: string;
}

const MyJobs = () => {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('all');
  const [jobs, setJobs] = useState<JobDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!wallet?.address) {
        setError('Wallet not connected');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/jobs?suiAddress=${wallet.address}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch jobs');
        }

        const data: JobDetails[] = await response.json();
        console.log("address data", data);
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching jobs');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [wallet?.address]);

  const getStatusColor = (status: JobStatus): string => {
    const colors: StatusColorMap = {
      'OPEN': 'bg-green-100 text-green-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-purple-100 text-purple-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredJobs = activeTab === 'all'
    ? jobs
    : jobs.filter(job => job.job_status === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-lg">Loading jobs...</div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <Badge variant="outline" className="px-3 py-1">
            {jobs.length} Total Jobs
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as JobStatus | 'all')} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="OPEN">Open</TabsTrigger>
            <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
            <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
            <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            {filteredJobs.map(job => (
              <Card key={job.id} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription>{job.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(job.job_status)}>
                      {job.job_status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>${job.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{job.project_length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{job.client_location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span>{job.client_rating} Rating</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(skill => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>{job.client_history.jobsPosted} Jobs Posted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{job.client_history.hireRate}% Hire Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Posted {new Date(job.time_posted).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MyJobs;
