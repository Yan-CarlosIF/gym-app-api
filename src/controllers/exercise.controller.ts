import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "@/lib/prisma";

type muscles =
  | "Peito"
  | "Costas"
  | "Bíceps"
  | "Tríceps"
  | "Ombros"
  | "Quadríceps"
  | "Posterior de coxa"
  | "Panturrilhas"
  | "Abdômen"
  | "Glúteos";

export async function addExercise(
  req: FastifyRequest<{ Body: { name: string; exerciseMuscles: muscles[] } }>,
  reply: FastifyReply
) {
  try {
    const userId = (req.user as { id: string }).id;
    const { name, exerciseMuscles } = req.body;

    if (!userId) {
      return reply.status(404).send({ mensage: "Usuário não validado" });
    }

    const muscles = await prisma.muscle.findMany({
      where: {
        name: {
          in: exerciseMuscles,
        },
      },
    });

    // Verifica se todos os músculos existem
    if (muscles.length !== exerciseMuscles.length) {
      const foundNames = muscles.map((m) => m.name);
      const notFound = exerciseMuscles.filter(
        (name) => !foundNames.includes(name)
      );
      return reply.status(400).send({
        mensage: "Alguns músculos não foram encontrados.",
        notFound,
      });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        userId,
      },
    });

    const muclesExercise = await prisma.muscleExercise.createMany({
      data: muscles.map((muscle) => ({
        exerciseId: exercise.id,
        muscleId: muscle.id,
      })),
    });

    return reply.status(201).send({ exercise, muclesExercise });
  } catch (err) {
    return reply
      .status(400)
      .send({ mensage: "Não foi possível criar o exercício", err });
  }
}
