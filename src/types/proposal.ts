// types/proposal.ts
export interface IProposal {
	freelancer_address: string;
	jobId: string;
	bid_type: 'FIXED' | 'MILESTONE';
	total_bid: number;
	project_duration: string;
	cover_letter: string;
	is_boost: boolean;
	is_draft: boolean;
	milestones?: IMilestone[];
	answers: IProposalAnswer[];
}

export interface IMilestone {
	id: string;
	description: string;
	amount: number;
	due_date: string;
	status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface IProposalAnswer {
	question: string;
	answer: string;
}
