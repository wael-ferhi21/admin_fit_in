import { api } from './client';
import type { ApiResponse, WorkoutSession, Exercise } from '../types';

export const getAllWorkouts = async (): Promise<WorkoutSession[]> => {
  const res = await api.get<ApiResponse<WorkoutSession[]>>('/workouts');
  return res.data;
};

export const createWorkout = async (body: Partial<WorkoutSession>): Promise<WorkoutSession> => {
  const res = await api.post<ApiResponse<WorkoutSession>>('/workouts', body);
  return res.data;
};

export const updateWorkout = async (id: string, body: Partial<WorkoutSession>): Promise<WorkoutSession> => {
  const res = await api.put<ApiResponse<WorkoutSession>>(`/workouts/${id}`, body);
  return res.data;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await api.delete(`/workouts/${id}`);
};

export const getAllExercises = async (): Promise<Exercise[]> => {
  const res = await api.get<ApiResponse<Exercise[]>>('/exercises');
  return res.data;
};

export const createExercise = async (body: Partial<Exercise>): Promise<Exercise> => {
  const res = await api.post<ApiResponse<Exercise>>('/exercises', body);
  return res.data;
};

export const updateExercise = async (id: string, body: Partial<Exercise>): Promise<Exercise> => {
  const res = await api.put<ApiResponse<Exercise>>(`/exercises/${id}`, body);
  return res.data;
};

export const deleteExercise = async (id: string): Promise<void> => {
  await api.delete(`/exercises/${id}`);
};
