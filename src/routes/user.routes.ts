import { authenticate } from "@/app";
import { addWorkout, getWorkouts } from "@/controllers/user.controller";
import { FastifyInstance } from "fastify";

export function userRoutes(app: FastifyInstance) {
  app.get("/get-workouts", { onRequest: [authenticate] }, getWorkouts);
  app.post("/add-workout", { onRequest: [authenticate] }, addWorkout);
}
