export const formatTimeDifference = (isoTime: string) => {
  const isoDate = new Date(isoTime);
  const currentDate = new Date();
  const timeDifference = currentDate - isoDate; // Difference in milliseconds

  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (hours < 1) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (days < 1) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (days < 2) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else {
    return isoDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // Example: "December 8, 2024"
  }
};
export function getStakingAmount(budget, stake): number {
  return +budget?.split("- ")[1] * (1 - stake / 100);
}
