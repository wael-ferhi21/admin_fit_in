import { api } from './client';
import type { ApiResponse, HealthMetrics } from '../types';

export const getMetricsByUser = async (userId: string): Promise<HealthMetrics[]> => {
  const res = await api.get<ApiResponse<HealthMetrics[]>>(`/metrics/user/${userId}`);
  return res.data;
};

export const getLatestMetrics = async (userId: string): Promise<HealthMetrics> => {
  const res = await api.get<ApiResponse<HealthMetrics>>(`/metrics/latest/${userId}`);
  return res.data;
};
