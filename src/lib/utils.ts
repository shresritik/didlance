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
