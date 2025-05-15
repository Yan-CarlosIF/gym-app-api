import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "@/lib/prisma";

export async function getExercises(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.user as { id: string }).id;

    const exercises = await prisma.exercise.findMany({
      where: {
        userId,
      },
      include: {
        muscles: {
          select: {
            muscle: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return reply.status(200).send(exercises);
  } catch (err) {
    return reply
      .status(404)
      .send({ message: "Não foi possivel acessar os exercícios", err });
  }
}

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

export async function deleteExercises(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = (req.user as { id: string }).id;

    await prisma.exercise.deleteMany({ where: { userId } });

    return reply
      .status(204)
      .send({ message: "Exercícios deletados com sucesso" });
  } catch (err) {
    return reply
      .status(400)
      .send({ message: "Não foi possivel deletar os exercícios", err });
  }
}

export async function deleteExercise(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = (req.user as { id: string }).id;
    const { id } = req.params;

    await prisma.exercise.delete({
      where: {
        id,
        userId,
      },
    });

    return reply
      .status(204)
      .send({ message: "Exercício deletado com sucesso" });
  } catch (err) {
    return reply
      .status(400)
      .send({ message: "Não foi possivel deletar o exercício", err });
  }
}

export async function updateExercise(
  req: FastifyRequest<{
    Body: { name: string; img: string };
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (req.user as { id: string }).id;
    const { img, name } = req.body;
    const { id } = req.params;

    const exercise = await prisma.exercise.update({
      where: {
        userId,
        id,
      },
      data: {
        img,
        name,
      },
    });

    return reply.status(200).send(exercise);
  } catch (err) {
    return reply
      .status(400)
      .send({ message: "Erro ao atualizar o exercício", err });
  }
}
