import { prisma } from "@/lib/prisma";

async function main() {
  const muscles = [
    "Peito",
    "Costas",
    "Bíceps",
    "Tríceps",
    "Ombros",
    "Quadríceps",
    "Posterior de coxa",
    "Panturrilhas",
    "Abdômen",
    "Glúteos",
  ];

  for (const name of muscles) {
    await prisma.muscle.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Músculos inseridos com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
