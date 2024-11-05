"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  Filter
} from 'lucide-react';

// Job interface for TypeScript
interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  timePosted: string;
  category: string;
  expertise: string;
  proposals: number;
  clientRating: number;
}


const JobFeed = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample job data - in real app, this would come from an API
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Smart Contract Developer Needed',
      description: 'Looking for an experienced developer to create and audit smart contracts on Sui network...',
      budget: '$1,000 - $2,000',
      timePosted: '2 hours ago',
      category: 'Blockchain',
      expertise: 'Expert',
      proposals: 12,
      clientRating: 4.8
    },
    {
      id: '2',
      title: 'DeFi Protocol Integration',
      description: 'Need help integrating various DeFi protocols into our existing platform...',
      budget: '$2,000 - $4,000',
      timePosted: '5 hours ago',
      category: 'DeFi',
      expertise: 'Intermediate',
      proposals: 8,
      clientRating: 4.5
    }
  ];
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Job Feed</h1>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Search and Category Filter */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="border rounded-md px-4 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Blockchain">Blockchain</option>
              <option value="DeFi">DeFi</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
            </select>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleJobClick(job.id)}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.timePosted}</span>
                          <span>•</span>
                          <Briefcase className="w-4 h-4" />
                          <span>{job.category}</span>
                          <span>•</span>
                          <Star className="w-4 h-4" />
                          <span>{job.clientRating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600">{job.budget}</span>
                      </div>
                    </div>

                    <p className="text-gray-600">{job.description}</p>

                    <div className="flex justify-between items-center pt-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {job.expertise}
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.proposals} proposals
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobFeed;
