import { FastifyInstance } from "fastify";

import {
  addExercise,
  deleteExercise,
  deleteExercises,
  getExercises,
  updateExercise,
} from "@/controllers/exercise.controller";
import { authenticate } from "@/middleware/authenticate";

export function exerciseRoutes(app: FastifyInstance) {
  app.get("/get", { onRequest: [authenticate] }, getExercises);
  app.route({
    method: "POST",
    url: "/add",
    onRequest: [authenticate],
    handler: addExercise,
  });
  app.delete("/delete", { onRequest: [authenticate] }, deleteExercises);
  app.route({
    method: "DELETE",
    url: "/delete/:id",
    onRequest: [authenticate],
    handler: deleteExercise,
  });
  app.route({
    method: "PATCH",
    url: "/update/:id",
    onRequest: [authenticate],
    handler: updateExercise,
  });
}
