import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobDetails } from '@/types/job-details';

// Define the response type from the API
interface JobsResponse {
	jobs: JobDetails[];
	totalPages?: number;
}

// Define the context type
type JobsContextType = {
	jobs: JobDetails[];
	setJobs: React.Dispatch<React.SetStateAction<JobDetails[]>>;
	addJob: (job: JobDetails) => void;
	updateJob: (id: string, updatedJob: Partial<JobDetails>) => void;
	deleteJob: (id: string) => void;
	getJobFeed: (selectedCategory?: string, page?: number) => Promise<void>;
	isLoading: boolean;
	error: string | null;
};

// Create the context
const JobsContext = createContext<JobsContextType | undefined>(undefined);

// Create the provider component
export function JobsProvider({ children }: { children: ReactNode }) {
	const [jobs, setJobs] = useState<JobDetails[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const addJob = (job: JobDetails) => {
		setJobs(prevJobs => [...prevJobs, job]);
	};

	const updateJob = (id: string, updatedJob: Partial<JobDetails>) => {
		setJobs(prevJobs =>
			prevJobs.map(job =>
				job.id === id ? { ...job, ...updatedJob } : job
			)
		);
	};

	const deleteJob = (id: string) => {
		setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
	};

	const getJobFeed = async (selectedCategory: string = 'all', page: number = 1): Promise<void> => {
		setIsLoading(true);
		setError(null);

		try {
			// Construct the URL with search parameters
			const params = new URLSearchParams({
				page: page.toString(),
				limit: '10',
				...(selectedCategory !== 'all' && { category: selectedCategory })
			});

			const response = await fetch(`/api/jobs?${params}`);

			if (!response.ok) {
				throw new Error('Failed to fetch jobs');
			}

			const data: JobsResponse = await response.json();

			setJobs(prevJobs => (page === 1 ? data.jobs : [...prevJobs, ...data.jobs]));
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'An error occurred';
			setError(errorMessage);
			console.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const value = {
		jobs,
		setJobs,
		addJob,
		updateJob,
		deleteJob,
		getJobFeed,
		isLoading,
		error
	};

	return (
		<JobsContext.Provider value={value}>
			{children}
		</JobsContext.Provider>
	);
}

// Custom hook to use the jobs context
export function useJobs() {
	const context = useContext(JobsContext);

	if (context === undefined) {
		throw new Error('useJobs must be used within a JobsProvider');
	}

	return context;
}
