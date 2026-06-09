import { api } from './client';
import type { ApiResponse, Coach } from '../types';

export const getAllCoaches = async (): Promise<Coach[]> => {
  const res = await api.get<ApiResponse<Coach[]>>('/coaches');
  return res.data;
};

export const getCoachByUserId = async (userId: string): Promise<Coach> => {
  const res = await api.get<ApiResponse<Coach>>(`/coaches/by-user/${userId}`);
  return res.data;
};

export const updateCoach = async (userId: string, body: Partial<Coach>): Promise<Coach> => {
  const res = await api.put<ApiResponse<Coach>>(`/coaches/${userId}`, body);
  return res.data;
};
