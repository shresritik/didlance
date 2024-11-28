// "use client"
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { useRouter } from 'next/navigation';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//   Search,
//   Briefcase,
//   Clock,
//   DollarSign,
//   Star,
//   Filter
// } from 'lucide-react';
// import { JobDetails } from '@/types/job-details';
// import { formatRelativeTime } from '@/lib/utils';
// import { useJobs } from '@/hooks/useJobs';

// const JobFeed = () => {
//   const router = useRouter();
//   const { jobs, setJobs } = useJobs();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const filteredJobs = jobs.filter(job => {
//     const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const handleJobClick = (jobId: string) => {
//     router.push(`/jobs/${jobId}`);
//   };
//   const getJobFeed = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Construct the URL with search parameters
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: '10',
//         ...(selectedCategory !== 'all' && { category: selectedCategory }),
//         ...(searchTerm && { search: searchTerm })
//       });

//       const response = await fetch(`/api/jobs?${params}`);

//       if (!response.ok) {
//         throw new Error('Failed to fetch jobs');
//       }

//       const data = await response.json();

//       // If it's the first page, replace the jobs array
//       // If it's a subsequent page, append to the existing jobs
//       setJobs(prevJobs => page === 1 ? data.jobs : [...prevJobs, ...data.jobs]);

//       // Update hasMore based on whether we received fewer items than requested
//       setHasMore(data.jobs.length === 10);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setPage(1)
//     getJobFeed();
//   }, [searchTerm, selectedCategory]);

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-6xl mx-auto space-y-6">
//           {/* Header */}
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold">Job Feed</h1>
//             <Button variant="outline">
//               <Filter className="w-4 h-4 mr-2" />
//               Filters
//             </Button>
//           </div>

//           {/* Search and Category Filter */}
//           <div className="flex gap-4 flex-wrap">
//             <div className="flex-1 min-w-[300px]">
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   className="pl-10"
//                   placeholder="Search jobs..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <select
//               className="border rounded-md px-4 py-2"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//               <option value="all">All Categories</option>
//               <option value="Blockchain">Blockchain</option>
//               <option value="DeFi">DeFi</option>
//               <option value="Frontend">Frontend</option>
//               <option value="Backend">Backend</option>
//             </select>
//           </div>

//           {/* Job Listings */}
//           <div className="space-y-4">
//             {filteredJobs.map((job) => (
//               <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleJobClick(job.id)}>
//                 <CardContent className="p-6">
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-xl font-semibold">{job.title}</h3>
//                         <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
//                           <Clock className="w-4 h-4" />
//                           <span>{formatRelativeTime(job.time_posted)}</span>
//                           <span>•</span>
//                           <Briefcase className="w-4 h-4" />
//                           <span>{job.category}</span>
//                           <span>•</span>
//                           <Star className="w-4 h-4" />
//                           <span>{job.client_rating}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <DollarSign className="w-4 h-4 text-green-600" />
//                         <span className="font-medium text-green-600">{job.budget}</span>
//                       </div>
//                     </div>

//                     <p className="text-gray-600">{job.description}</p>

//                     <div className="flex justify-between items-center pt-4">
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">
//                           {job.expertise}
//                         </Button>
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {job.proposals.length} proposals
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default JobFeed;
