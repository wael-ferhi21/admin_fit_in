import { api } from './client';
import type { ApiResponse, MealPlan, Meal } from '../types';

export const getAllMealPlans = async (): Promise<MealPlan[]> => {
  const res = await api.get<ApiResponse<MealPlan[]>>('/meal-plans');
  return res.data;
};

export const deleteMealPlan = async (id: string): Promise<void> => {
  await api.delete(`/meal-plans/${id}`);
};

export const getAllMeals = async (): Promise<Meal[]> => {
  const res = await api.get<ApiResponse<Meal[]>>('/meals');
  return res.data;
};

export const createMeal = async (body: Partial<Meal>): Promise<Meal> => {
  const res = await api.post<ApiResponse<Meal>>('/meals', body);
  return res.data;
};

export const updateMeal = async (id: string, body: Partial<Meal>): Promise<Meal> => {
  const res = await api.put<ApiResponse<Meal>>(`/meals/${id}`, body);
  return res.data;
};

export const updateMealPlan = async (id: string, body: Partial<MealPlan>): Promise<MealPlan> => {
  const res = await api.put<ApiResponse<MealPlan>>(`/meal-plans/${id}`, body);
  return res.data;
};

export const deleteMeal = async (id: string): Promise<void> => {
  await api.delete(`/meals/${id}`);
};
