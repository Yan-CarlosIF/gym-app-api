import { FastifyInstance } from "fastify";

import {
  addExerciseToWorkout,
  addWorkout,
  deleteWorkout,
  deleteWorkouts,
  getWorkouts,
} from "@/controllers/workout.controller";
import { authenticate } from "@/middleware/authenticate";

export function workoutRoutes(app: FastifyInstance) {
  app.get("/get", { onRequest: [authenticate] }, getWorkouts);
  app.route({
    method: "POST",
    url: "/add",
    onRequest: [authenticate],
    handler: addWorkout,
  });
  app.route({
    method: "POST",
    url: "/add-exercise",
    onRequest: [authenticate],
    handler: addExerciseToWorkout,
  });
  app.delete("/delete", { onRequest: [authenticate] }, deleteWorkouts);
  app.route({
    method: "DELETE",
    url: "/delete/:id",
    onRequest: [authenticate],
    handler: deleteWorkout,
  });
}
