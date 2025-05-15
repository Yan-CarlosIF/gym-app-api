import { FastifyInstance } from "fastify";

import { getUser, updateUser } from "@/controllers/user.controller";
import { authenticate } from "@/middleware/authenticate";

export function userRoutes(app: FastifyInstance) {
  app.get("/get", { onRequest: [authenticate] }, getUser);
  app.route({
    method: "PATCH",
    url: "/update",
    onRequest: [authenticate],
    handler: updateUser,
  });
}
