"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  DollarSign,
  Star,
  BookmarkPlus,
  BookmarkCheck,
  Globe,
  Calendar,
  ArrowLeft,
  Terminal,
  Flag,
  Shield,
  Layers,
  CircleUserRound,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { JobDetails } from "@/types/job-details";
import { useJobs } from "@/hooks/useJobs";
import { formatRelativeTime, queryClient, truncateHex } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import ProposalCard from "@/components/MyJob/ProposalCard";
import { job_details, JobStatus, Proposal } from "@prisma/client";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { useMutation, useQuery } from "@tanstack/react-query";

type JobDetailsWithRelations = job_details & {
  job_proposals: Proposal[];
};

type ClientHistory = Record<string, string> & {
  verificationStatus?: {
    payment: boolean;
  };
};

const JobPage = () => {
  const { jobs } = useJobs();
  const router = useRouter();
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const wallet = useWallet();
  const [projectStatus, setProjectStatus] = useState<string>("");

  const fetchJobDetails = async (): Promise<JobDetailsWithRelations> => {
    const data = await fetch("/api/jobs/" + params.jobId);

    return await data.json();
  };
  const { data: job, isLoading } = useQuery({
    queryKey: ["job"],
    queryFn: fetchJobDetails,
  });

  const updateJob = async (): Promise<any> => {
    const data = await fetch("/api/jobs/" + job.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ job_status: projectStatus }),
    });
    return await data.json();
  };

  const { mutate } = useMutation<void, Error, void>({
    mutationFn: updateJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
  });

  const handleApply = () => {
    setIsApplying(true);
    // Add application logic here
    // setTimeout(() => {
    //   router.push(`/jobs/${params?.jobId}/apply`);
    // }, 500);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };
  useEffect(() => {
    if (!job) return;
    wallet.address === job?.sui_address ||
    !!job?.job_proposals.find((el) => el.sui_address === wallet.address)
      ? setIsApplying(true)
      : setIsApplying(false);
  }, [wallet, job]);

  const handleStatus = async () => {
    mutate();
  };
  useEffect(() => {
    if (job) setProjectStatus(job.job_status);
  }, [job]);

  if (isLoading || !job) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 --font-lato-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation */}
        <nav className="flex items-center space-x-4 text-sm">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-transparent p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">{job.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="description" className="space-y-4">
              <TabsList>
                <TabsTrigger value="description">Job Details</TabsTrigger>
                <TabsTrigger value="proposals">
                  {job.job_proposals?.length} Proposals
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6">
                {/* Job Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold">{job.title}</h1>
                        <Button
                          variant="ghost"
                          onClick={toggleSave}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <BookmarkPlus className="w-5 h-5" />
                          )}
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-4 h-4" />
                          {job.category}
                        </span>
                        <span
                          className="flex items-center gap-1"
                          suppressHydrationWarning={true}
                        >
                          <Clock className="w-4 h-4" />
                          Posted {formatRelativeTime(job.time_posted)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {job.client_location}
                        </span>
                      </div>

                      <p className="text-gray-600">{job.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">{job.budget}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            <span>{job.expertise} level</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{job.project_length}</span>
                          </div>
                          {job.weekly_hours && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{job.weekly_hours}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{job.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Questions */}
                {job.questions && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {job.questions.map((question, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-gray-500">{index + 1}.</span>
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="proposals">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      Only freelancers who have submitted proposals can view
                      this section
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  {wallet.address === job.sui_address ? (
                    <>
                      <select
                        defaultValue={job.job_status}
                        onChange={(e) => setProjectStatus(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option
                          className="bg-white w-full border-b px-5 my-2 "
                          value="IN_PROGRESS"
                        >
                          IN PROGRESS
                        </option>
                        <option
                          className="bg-white w-full border-b px-5 my-2 "
                          value="OPEN"
                        >
                          OPEN
                        </option>
                        <option
                          className="bg-white w-full border-b px-5 my-2 "
                          value="COMPLETED"
                        >
                          COMPLETED
                        </option>
                        <option
                          className="bg-white w-full border-b px-5 my-2 "
                          value="CANCELLED"
                        >
                          CANCELLED
                        </option>
                      </select>
                      <Button
                        className="w-full"
                        disabled={isLoading}
                        onClick={handleStatus}
                      >
                        {"Update Status"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full"
                        disabled={isApplying}
                        onClick={handleApply}
                      >
                        <Link
                          className="w-full"
                          href={`/jobs/${params?.jobId}/apply`}
                        >
                          {" "}
                          {"Apply Now"}
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={toggleSave}
                      >
                        {isSaved ? "Saved" : "Save Job"}
                      </Button>
                    </>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      {job.job_proposals?.length} proposals
                    </p>
                    <p className="text-sm text-gray-500">{job.activity_on}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Client Card */}
            <Card>
              <CardHeader>
                <CardTitle>About the Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Verification Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CircleUserRound className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">
                      {truncateHex(job.sui_address)}{" "}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(job.client_history as ClientHistory)?.verificationStatus
                      .payment && <Shield className="w-4 h-4 text-green-500" />}
                    <span className="text-sm">Payment verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">
                      {job.client_rating as any} rating
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    <span className="text-sm" suppressHydrationWarning>
                      Member since{" "}
                      {formatRelativeTime(
                        (job.client_history as ClientHistory)?.memberSince
                      )}{" "}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Client Stats */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Jobs Posted</p>
                    <p className="text-2xl font-semibold">
                      {(job.client_history as ClientHistory)?.jobsPosted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hire Rate</p>
                    <div className="space-y-2">
                      <p className="text-2xl font-semibold">
                        {(job.client_history as ClientHistory)?.hireRate}%
                      </p>
                      <Progress
                        value={
                          (job.client_history as ClientHistory)
                            ?.hireRate as unknown as number
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Spent</p>
                    <p className="text-2xl font-semibold">
                      {(job.client_history as ClientHistory)?.totalSpent}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {wallet.address === job.sui_address && (
          <div>
            <CardTitle className="mb-5 ml-3">
              Proposals: {job.job_proposals?.length}
            </CardTitle>
            {job.job_proposals.map((proposal: any) => {
              const pr = {
                ...proposal,
                job: {
                  title: job.title,
                  description: job.description,
                  budget: job.budget,
                  project_length: job.project_length,
                  skills: job.skills,
                  status: job.job_status,
                  min_stake: job.min_stake,
                },
              };
              return <ProposalCard key={proposal.id} proposal={pr} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPage;
