
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

