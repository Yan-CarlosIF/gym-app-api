import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "@/../prisma/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { app } from "@/app";

export async function register(
  req: FastifyRequest<{
    Body: Pick<User, "name" | "password" | "email" | "avatar_url">;
  }>,
  reply: FastifyReply
) {
  try {
    const { email, name, password, avatar_url } = req.body;

    if (!email || !name || !password) {
      return reply.send(400).send({ error: "Dados inválidos" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        avatar_url,
      },
    });

    return reply.status(201).send(user);
  } catch {
    return reply
      .status(400)
      .send({ error: "Não foi possivel criar o usuário" });
  }
}

export async function login(
  req: FastifyRequest<{
    Body: Pick<User, "password" | "email">;
  }>,
  reply: FastifyReply
) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!email || !passwordMatch) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    const token = app.jwt.sign({ id: user.id }, { expiresIn: "7d" });

    return reply.status(200).send({ token });
  } catch {
    return reply.status(500).send({ error: "Erro interno ao fazer login" });
  }
}
