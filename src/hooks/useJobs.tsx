import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobDetails } from '@/types/job-details';

// Define the context type
type JobsContextType = {
	jobs: JobDetails[];
	setJobs: React.Dispatch<React.SetStateAction<JobDetails[]>>;
	addJob: (job: JobDetails) => void;
	updateJob: (id: string, updatedJob: Partial<JobDetails>) => void;
	deleteJob: (id: string) => void;
};

// Create the context
const JobsContext = createContext<JobsContextType | undefined>(undefined);

// Create the provider component
export function JobsProvider({ children }: { children: ReactNode }) {
	const [jobs, setJobs] = useState<JobDetails[]>([]);

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

	return (
		<JobsContext.Provider value={{ jobs, setJobs, addJob, updateJob, deleteJob }}>
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
