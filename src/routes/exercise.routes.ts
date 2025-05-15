import { FastifyInstance } from "fastify";

import { addExercise } from "@/controllers/exercise.controller";
import { authenticate } from "@/middleware/authenticate";

export function exerciseRoutes(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/add",
    onRequest: [authenticate],
    handler: addExercise,
  });
}
