import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "@/lib/prisma";

export async function getWorkouts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.user as { id: string }).id;

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
      },
      include: {
        exercises: {
          orderBy: {
            sequence: "asc",
          },
          include: {
            exercise: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    reply.status(200).send(workouts);
  } catch (err) {
    return reply
      .status(404)
      .send({ message: "Erro ao buscar treinos do usuário", err });
  }
}

type Exercise = {
  exerciseId: string;
  reps: number;
  sets: number;
};

type AddWorkoutRequest = FastifyRequest<{
  Body: {
    name: string;
    exercisesInfos: Exercise[];
  };
}>;

export async function addWorkout(req: AddWorkoutRequest, reply: FastifyReply) {
  try {
    const userId = (req.user as { id: string }).id;
    const { name, exercisesInfos } = req.body;

    const workout = await prisma.workout.create({
      data: {
        name,
        userId,
      },
    });

    const exerciseCount = await prisma.workoutExercise.count({
      where: {
        workoutId: workout.id,
      },
    });

    if (exercisesInfos) {
      await prisma.workoutExercise.createMany({
        data: exercisesInfos.map((exercise, index) => ({
          workoutId: workout.id,
          exerciseId: exercise.exerciseId,
          sequence: exerciseCount + index + 1,
          sets: exercise.sets,
          reps: exercise.reps,
        })),
      });
    }

    return reply.status(201).send(workout);
  } catch (err) {
    return reply
      .status(400)
      .send({ message: "Não foi possivel adicionar treino", err });
  }
}

export async function addExerciseToWorkout(
  req: FastifyRequest<{ Body: { exercise: Exercise; workoutId: string } }>,
  reply: FastifyReply
) {
  try {
    const { exercise, workoutId } = req.body;

    const exerciseCount = await prisma.workoutExercise.count({
      where: {
        workoutId,
      },
    });

    const newExercise = await prisma.workoutExercise.create({
      data: {
        exerciseId: exercise.exerciseId,
        workoutId,
        reps: exercise.reps,
        sets: exercise.sets,
        sequence: exerciseCount + 1,
      },
    });

    return reply.status(201).send(newExercise);
  } catch (err) {
    return reply.status(400).send({
      message: "Não foi possivel adicionar o exercício ao treino",
      err,
    });
  }
}

export async function deleteWorkouts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.user as { id: string }).id;

    if (!userId)
      return reply.status(401).send({ message: "Usuário não logado" });

    const workouts = await prisma.workout.deleteMany();

    return reply.status(200).send(workouts);
  } catch (err) {
    return reply.status(400).send({ message: "Erro ao deletar treinos", err });
  }
}
