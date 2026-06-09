import { api } from './client';
import type { ApiResponse, Recommendation } from '../types';

export const getRecommendationsByUser = async (userId: string): Promise<Recommendation[]> => {
  const res = await api.get<ApiResponse<Recommendation[]>>(`/recommendations/user/${userId}`);
  return res.data;
};

export const createRecommendation = async (userId: string, type: 'meal' | 'workout' | 'lifestyle') => {
  const res = await api.post<ApiResponse<Recommendation>>('/recommendations', { userId, type });
  return res.data;
};

export const deleteRecommendation = async (id: string): Promise<void> => {
  await api.delete(`/recommendations/${id}`);
};
