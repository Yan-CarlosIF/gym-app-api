import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "@/lib/prisma";

export async function getUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.user as { id: string }).id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        workout: {
          include: {
            exercises: true,
          },
        },
        exercises: {
          include: {
            muscles: {
              include: {
                muscle: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    reply.status(200).send(user);
  } catch (err) {
    reply.status(401).send({ message: "Usuário não autenticado", err });
  }
}
