export interface JobDetails {
	id: string;
	sui_address: string;
	title: string;
	description: string;
	long_description: string;
	budget: string;
	time_posted: string;
	category: string;
	expertise: string;
	proposals: String[];
	client_rating: number;
	client_location: string;
	job_type: string;
	project_length: string;
	weekly_hours?: string;
	skills: string[];
	activity_on: string;
	job_status: JobStatus;
	client_history: {
		jobsPosted: number;
		hireRate: number;
		totalSpent: string;
		memberSince: string;
		verificationStatus: {
			payment: boolean;
			phone: boolean;
			email: boolean;
		}
	};
	attachments?: string[];
	questions?: string[];
}
export enum JobStatus {
	OPEN = 'OPEN',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}
