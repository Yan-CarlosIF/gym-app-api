import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "@/lib/prisma";

export async function getUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.user as { id: string }).id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    reply.status(200).send(user);
  } catch (err) {
    reply.status(401).send({ message: "Usuário não autenticado", err });
  }
}

type updatePayload = {
  avatar_url?: string | null;
  name?: string;
  password?: string;
};

export async function updateUser(
  req: FastifyRequest<{ Body: { user?: updatePayload } }>,
  reply: FastifyReply
) {
  try {
    const userId = (req.user as { id: string }).id;

    // Se user for undefined, já responde com erro 400
    const user = req.body.user;
    if (!user) {
      return reply.status(400).send({
        message: "Corpo da requisição malformado: 'user' não fornecido.",
      });
    }

    const { avatar_url, name, password } = user;

    const data: updatePayload = {};

    if (avatar_url !== undefined) data.avatar_url = avatar_url;

    if (name != null) data.name = name;

    if (password != null) data.password = await bcrypt.hash(password, 10);

    if (Object.keys(data).length === 0) {
      return reply.status(400).send({
        message: "Nenhum dado válido fornecido para atualização.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return reply.status(200).send(updatedUser);
  } catch (err) {
    return reply.status(404).send({
      message: "Não foi possível atualizar as informações do usuário",
      err,
    });
  }
}
