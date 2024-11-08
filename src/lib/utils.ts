"use client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
const digitalArtUrls = [
  "https://picsum.photos/seed/art1/32/32",
  "https://picsum.photos/seed/art2/32/32",
  "https://picsum.photos/seed/art3/32/32",
  "https://picsum.photos/seed/art4/32/32",
  "https://picsum.photos/seed/art5/32/32",
  "https://picsum.photos/seed/art6/32/32",
  "https://picsum.photos/seed/art7/32/32",
  "https://picsum.photos/seed/art8/32/32",
  "https://picsum.photos/seed/art9/32/32",
  "https://picsum.photos/seed/art10/32/32",
  // Add more URLs with different seeds to diversify the images
];
export const getRandomDigitalArt = () => {
  const randomIndex = Math.floor(Math.random() * digitalArtUrls.length);
  return digitalArtUrls[randomIndex];
};
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Just now: less than 1 minute ago
  if (diffInSecs < 60) {
    return 'just now';
  }

  // Minutes: 1-59 minutes ago
  if (diffInMins < 60) {
    return diffInMins === 1 ? '1 min ago' : `${diffInMins} mins ago`;
  }

  // Hours: 1-23 hours ago
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hr ago' : `${diffInHours} hrs ago`;
  }

  // Days: 1+ days ago
  return `${diffInDays}d ago`;
}

// Helper function to convert VAPID key

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+') // Replace '-' with '+'
    .replace(/_/g, '/'); // Replace '_' with '/'
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// By client to freelancer saying proposal accepted
export const notifyProposalAccepted = async (
  freelancerAddress: string,
  jobTitle: string,
  jobId: string
) => {
  try {
    await fetch('/api/notifications/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sui_address: freelancerAddress,
        title: 'Proposal Accepted',
        message: `Your proposal for "${jobTitle}" has been accepted!`,
        type: 'proposal_accepted',
        metadata: {
          jobId,
          jobTitle,
        },
      }),
    })
  } catch (error) {
    console.error('Failed to send notification:', error)
  }
}

// for sending the job proposal request by the freelancer
export const notifyJobApplication = async (
  jobOwnerAddress: string,
  freelancerAddress: string,
  jobTitle: string,
  jobId: string
) => {
  try {
    await fetch('/api/notifications/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sui_address: jobOwnerAddress,
        title: 'New Job Application',
        message: `A freelancer has applied for "${jobTitle}"`,
        type: 'job_application',
        metadata: {
          jobId,
          freelancerAddress,
          jobTitle,
        },
      }),
    })
  } catch (error) {
    console.error('Failed to send notification:', error)
  }
}
