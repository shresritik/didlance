import { prisma } from "@/lib/prisma";

async function main() {
  const membershipStatuses = [
    {
      name: "ENTRY_LEVEL",
      price: 50.0,
    },
    {
      name: "INTERMEDIATE",
      price: 100.0,
    },
    {
      name: "EXPERT",
      price: 500.0,
    },
  ];

  for (const status of membershipStatuses) {
    await prisma.membershipStatus.upsert({
      where: { name: status.name },
      update: {}, // Prevent duplication if the status already exists
      create: {
        name: status.name,
        price: status.price,
      },
    });
  }

  console.log("Membership statuses have been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
