import { FastifyInstance } from "fastify";

import { login, register } from "@/controllers/auth.controller";

export function authRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
}
