export interface JobDetails {
	id: string;
	sui_address: string;
	title: string;
	description: string;
	longDescription: string;
	budget: string;
	time_posted: string;
	category: string;
	expertise: string;
	proposals: number;
	client_rating: number;
	client_location: string;
	jobType: string;
	project_length: string;
	weeklyHours?: string;
	skills: string[];
	activityOn: string;
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
