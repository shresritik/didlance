// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { JobDetails } from "@/types/job-details";
// import { useToast } from "@/hooks/use-toast";
// import { IProposal } from "@/types/proposal";
// import { IProposalAnswer } from "@/types/proposal";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ArrowLeft, Plus, Trash2, DollarSign, Save, Send } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
// import { useJobs } from "@/hooks/useJobs";
// import { useWallet } from "@suiet/wallet-kit";
// import { notifyJobApplication } from "@/lib/utils";

// interface Milestone {
//   id: string;
//   description: string;
//   due_date: string;
//   amount: number;
// }

// const JobApplicationPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const { jobs } = useJobs();
//   const wallet = useWallet();
//   const { toast } = useToast();
//   const [job, setJob] = useState<JobDetails | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [bidType, setBidType] = useState<"fixed" | "milestone">("fixed");
//   const [totalBid, setTotalBid] = useState("");
//   const [serviceFee, setServiceFee] = useState(0);
//   const [youllReceive, setYoullReceive] = useState(0);
//   const [projectDuration, setProjectDuration] = useState("");
//   const [coverLetter, setCoverLetter] = useState("");
//   const [milestones, setMilestones] = useState<Milestone[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [isBoost, setIsBoost] = useState(false);
//   const [esCrow, setEsCrow] = useState(false);
//   const [isDraft, setIsDraft] = useState(false);
//   const [error, setError] = useState<String>();

//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         setIsLoading(true);

//         // Check if jobs exist and the jobId parameter is valid
//         if (jobs && params?.jobId) {
//           // Find the job with the matching jobId
//           const foundJob = jobs.find((job) => job.id === params.jobId);

//           if (foundJob) {
//             setJob(foundJob); // Set the job details
//           } else {
//             setError("Job not found.");
//           }
//         }
//       } catch (err) {
//         setError("An error occurred while fetching job details.");
//       } finally {
//         setIsLoading(false); // End loading state
//       }
//     };

//     if (params?.jobId) {
//       fetchJobDetails();
//     }
//   }, [params?.jobId]);

//   useEffect(() => {
//     // Calculate service fee and amount you'll receive
//     const bidAmount = parseFloat(totalBid) || 0;
//     const fee = bidAmount * 0.2; // 20% service fee
//     setServiceFee(fee);
//     setYoullReceive(bidAmount - fee);
//   }, [totalBid]);

//   const addMilestone = () => {
//     const newMilestone: Milestone = {
//       id: Date.now().toString(),
//       description: "",
//       due_date: "",
//       amount: 0,
//     };
//     setMilestones([...milestones, newMilestone]);
//   };

//   const removeMilestone = (id: string) => {
//     setMilestones(milestones.filter((m) => m.id !== id));
//   };

//   const updateMilestone = (
//     id: string,
//     field: keyof Milestone,
//     value: string | number
//   ) => {
//     setMilestones(
//       milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
//     );
//   };

//   const handleProposalSubmit = async (isDraft: boolean = false) => {
//     try {
//       setIsSubmitting(true);

//       if (wallet?.address === undefined || params?.job) return;
//       const proposal: IProposal = {
//         freelancer_address: wallet?.address, // Your Sui wallet address
//         jobId: params?.jobId as string,
//         bid_type: bidType === "milestone" ? "MILESTONE" : "FIXED",
//         total_bid: parseFloat(totalBid),
//         project_duration: projectDuration,
//         cover_letter: coverLetter,
//         milestones: bidType === "milestone" ? milestones : [],
//         answers: Object.entries(answers).map(([question, answer]) => ({
//           question,
//           answer,
//         })),
//         is_boost: isBoost,
//         is_draft: isDraft,
//       };

//       const response = await fetch("/api/proposals", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(proposal),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to submit proposal");
//       }

//       const result = await response.json();
//       toast({
//         variant: "destructive",
//         title: `${
//           isDraft
//             ? "Proposal saved as draft"
//             : "Proposal submitted successfully"
//         }`,
//         description: "View in your Jobs section.",
//         className: "bg-green-500 text-white",
//       });

//       router.push(`/dashboard/my-proposals`);
//     } catch (error) {
//       console.error("Error submitting proposal:", error);
//       toast({
//         variant: "destructive",
//         title: "Failed to submit purposal. Please try again.",
//         description: "View in your Jobs section.",
//         className: "bg-red-500 text-white",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmit = async (isDraft: boolean = false) => {
//     if (job?.sui_address.toLowerCase() === wallet?.address) {
//       toast({
//         variant: "destructive",
//         title: "You are the client of the project.",
//         description: "Failed to submit purposal.",
//         className: "bg-red-500 text-white",
//       });
//       return;
//     }
//     setIsDraft(isDraft);
//     const proposal = {
//       jobId: params?.jobId,
//       bidType,
//       totalBid: parseFloat(totalBid),
//       projectDuration,
//       coverLetter,
//       milestones: bidType === "milestone" ? milestones : [],
//       answers,
//       isBoost,
//       isDraft,
//     };

//     // console.log("Submitting proposal:", proposal);
//     // Add your submission logic here

//     await handleProposalSubmit(isDraft);

//     // Redirect after submission
//     const currentProposals = Array.isArray(job?.proposals) ? job.proposals : [];
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;
//     const updatedProposals = [...currentProposals, wallet?.address, userId];
//     const updateResponse = await fetch(`/api/jobs/${job?.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ proposals: updatedProposals }),
//     });
//     if (!updateResponse.ok) {
//       const errorData = await updateResponse.json();
//       console.error("Failed to add proposal:", errorData.error);
//       return;
//     }

//     const updatedJob = await updateResponse.json();
//     // console.log("Proposal added successfully:", updatedJob);
//     // Push notification
//     toast({
//       variant: "destructive",
//       title: "Job Applied Successfully",
//       description: "View in your Jobs section.",
//       className: "bg-green-500 text-white",
//     });
//     notifyJobApplication(
//       job?.sui_address!,
//       wallet?.address!,
//       job?.title!,
//       job?.id!
//     );

//     //freelancer address jobtitle job id
//     // if (isDraft) {
//     //   router.push("/proposals/drafts");
//     // } else {
//     //   router.push("/my-jobs");
//     // }
//   };

//   if (isLoading || !job) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-4xl mx-auto">
//           <div className="animate-pulse space-y-4">
//             <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//             <div className="h-40 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Navigation */}
//         <nav className="flex items-center space-x-4 text-sm">
//           <Button
//             variant="ghost"
//             onClick={() => router.back()}
//             className="hover:bg-transparent p-0"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Job Details
//           </Button>
//         </nav>

//         {/* Job Title */}
//         <Card>
//           <CardContent className="p-6">
//             <h1 className="text-2xl font-bold">{job.title}</h1>
//             <p className="text-sm text-gray-500 mt-2">
//               Project Budget: {job.budget}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Bid Details */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Your Proposal</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Bid Type Selection */}
//             <div className="space-y-4">
//               <Label>How do you want to be paid?</Label>
//               <RadioGroup
//                 defaultValue="fixed"
//                 onValueChange={(value) =>
//                   setBidType(value as "fixed" | "milestone")
//                 }
//                 className="space-y-4"
//               >
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="fixed" id="fixed" />
//                   <Label htmlFor="fixed">By project (fixed price)</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="milestone" id="milestone" />
//                   <Label htmlFor="milestone">By milestone</Label>
//                 </div>
//               </RadioGroup>
//             </div>

//             <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50 rounded-lg">
//               <div>
//                 <h4 className="font-medium">Escrow</h4>
//               </div>
//               <Switch checked={esCrow} onCheckedChange={setEsCrow} />
//             </div>

//             {/* Bid Amount */}

//             <div
//               className={`space-y-4 p-4 ${!esCrow && "bg-gray-60 opacity-60"}`}
//             >
//               <Label>Bid Amount</Label>
//               <div className="relative">
//                 <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//                 <Input
//                   disabled={!esCrow}
//                   type="number"
//                   placeholder="Enter your bid amount"
//                   value={totalBid}
//                   onChange={(e) => setTotalBid(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between text-gray-500">
//                   <span>Service Fee (20%)</span>
//                   <span>-${serviceFee.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between font-medium">
//                   <span>You'll Receive</span>
//                   <span>${youllReceive.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Cover Letter</Label>
//               <Textarea
//                 disabled={esCrow}
//                 placeholder="Write a detailed cover letter..."
//                 value={coverLetter}
//                 onChange={(e) => setCoverLetter(e.target.value)}
//                 className={`min-h-[200px] ${
//                   esCrow ? "bg-gray-50" : "bg-white"
//                 }`}
//               />
//             </div>

//             {/* Project Duration */}
//             <div className="space-y-2">
//               <Label>How long will this project take?</Label>
//               <Select onValueChange={setProjectDuration}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select project duration" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="less_than_1_month">
//                     Less than 1 month
//                   </SelectItem>
//                   <SelectItem value="1_to_3_months">1 to 3 months</SelectItem>
//                   <SelectItem value="3_to_6_months">3 to 6 months</SelectItem>
//                   <SelectItem value="more_than_6_months">
//                     More than 6 months
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Additional Questions */}
//             {job.questions && (
//               <div className="space-y-4">
//                 <h3 className="font-medium">Additional Questions</h3>
//                 {job.questions.map((question, index) => (
//                   <div key={index} className="space-y-2">
//                     <Label>
//                       {question}
//                       {}
//                     </Label>
//                     <Textarea
//                       placeholder="Type your answer..."
//                       value={answers[index] || ""}
//                       onChange={(e) =>
//                         setAnswers({ ...answers, [index]: e.target.value })
//                       }
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Boost Proposal */}
//             <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50 rounded-lg">
//               <div>
//                 <h4 className="font-medium">Boost your proposal</h4>
//                 <p className="text-sm text-gray-500">
//                   Get your proposal in front of the client first
//                 </p>
//               </div>
//               <Switch checked={isBoost} onCheckedChange={setIsBoost} />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Submit Buttons */}
//         <div className="flex justify-between items-center">
//           <Button variant="outline" onClick={() => handleSubmit(true)}>
//             <Save className="w-4 h-4 mr-2" />
//             Save Draft
//           </Button>
//           <div className="space-x-4">
//             <Button variant="outline" onClick={() => router.back()}>
//               Cancel
//             </Button>
//             <Button onClick={() => handleSubmit(false)}>
//               <Send className="w-4 h-4 mr-2" />
//               Submit Proposal
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobApplicationPage;
