// types/notification.ts
export interface Notification {
  id: string;
  suiAddress: string;
  title: string;
  message: string;
  type: "job_application" | "proposal_accepted" | "payment_received" | string;
  metadata?: {
    jobId?: string;
    freelancerAddress?: string;
    amount?: string;
    jobTitle?: string;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: string;
}
