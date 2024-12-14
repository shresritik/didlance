export const memberships = [
  {
    title: "Entry Level",
    price: 50,
    description: "Perfect for freelancers just starting out.",
    features: [
      "Apply to up to 10 jobs per month",
      "Access to entry-level job listings",
      "24/7 email support",
    ],
  },
  {
    title: "Intermediate",
    price: 100,
    description: "Ideal for established freelancers looking to grow.",
    features: [
      "Apply to up to 50 jobs per month",
      "Access to all job listings except premium",
    ],
    popular: true,
  },
  {
    title: "Expert",
    price: 500,
    description: "For top-tier freelancers seeking premium opportunities.",
    features: [
      "Unlimited job applications",
      "Access to all job listings, including premium",
      "Verified Elite badge",
    ],
  },
];

export const membershipStatus = {
  "Entry Level": "ENTRY_LEVEL",
  Intermediate: "INTERMEDIATE",
  Expert: "EXPERT",
};

export const membershipSnakeCase = {
  ENTRY_LEVEL: "Entry Level",
  INTERMEDIATE: "Intermediate",
  EXPERT: "Expert",
};
