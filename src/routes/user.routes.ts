import { FastifyInstance } from "fastify";

import { getUser } from "@/controllers/user.controller";
import { authenticate } from "@/middleware/authenticate";

export function userRoutes(app: FastifyInstance) {
  app.get("/get", { onRequest: [authenticate] }, getUser);
}
