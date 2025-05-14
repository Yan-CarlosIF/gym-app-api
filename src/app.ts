import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { authRoutes } from "./routes/auth.routes";
import { prisma } from "./lib/prisma";
import { userRoutes } from "./routes/user.routes";

export const app = fastify();

app.register(fastifyCors);
app.register(fastifyJwt, {
  secret: process.env.SECRET_JWT!,
});

// app.decorate(
//   "authenticate",
//   async (req: FastifyRequest, reply: FastifyReply) => {
//     try {
//       await req.jwtVerify();
//     } catch {
//       return reply.status(401).send({ error: "Token inválido ou ausente" });
//     }
//   }
// );

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ error: "Token inválido ou ausente" });
  }
}

app.get("/", () => {
  return "chama";
});

app.get("/users", async (_req, reply: FastifyReply) => {
  try {
    const users = await prisma.user.findMany();
    reply.send({ users });
  } catch (err) {
    reply.send(err);
  }
});

app.register(authRoutes, { prefix: "auth" });
app.register(userRoutes, { prefix: "user" });

app.listen({ port: 3000, host: "0.0.0.0" }, () => {
  console.log("App running at http://localhost:3000");
});
