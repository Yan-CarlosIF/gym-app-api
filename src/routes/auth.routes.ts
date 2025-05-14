import { login, register } from "@/controllers/auth.controller";
import { FastifyInstance } from "fastify";

export function authRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
}
