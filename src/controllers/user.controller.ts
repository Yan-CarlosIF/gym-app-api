import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getWorkouts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.user as { id: string }).id;

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
      },
      include: {
        exercises: true,
      },
    });

    reply.status(200).send({ workouts });
  } catch {
    return reply
      .status(404)
      .send({ error: "Erro ao buscar treinos do usuário" });
  }
}

export async function addWorkout(
  req: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = (req.user as { id: string }).id;
    const { name } = req.body;

    const workout = await prisma.workout.create({
      data: {
        name,
        userId,
      },
    });

    return reply.status(201).send({ workout });
  } catch {
    return reply
      .status(400)
      .send({ error: "Não foi possivel adicionar treino" });
  }
}
