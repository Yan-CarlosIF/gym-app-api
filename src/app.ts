import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";

import { authRoutes } from "./routes/auth.routes";
import { exerciseRoutes } from "./routes/exercise.routes";
import { userRoutes } from "./routes/user.routes";
import { workoutRoutes } from "./routes/workout.routes";

const PORT = 3000;

export const app = fastify();

app.register(fastifyCors);
app.register(fastifyJwt, {
  secret: process.env.SECRET_JWT!,
});

app.get("/", () => {
  return { API: "API Running!" };
});

app.register(authRoutes, { prefix: "auth" });
app.register(workoutRoutes, { prefix: "workout" });
app.register(exerciseRoutes, { prefix: "exercise" });
app.register(userRoutes, { prefix: "user" });

app.listen({ port: PORT, host: "0.0.0.0" }, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
