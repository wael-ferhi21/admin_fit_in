import { api } from './client';
import type { ApiResponse, User, DashboardStats } from '../types';

export const getStats = async (): Promise<DashboardStats> => {
  const res = await api.get<ApiResponse<DashboardStats>>('/users/stats');
  return res.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get<ApiResponse<User[]>>('/users');
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get<ApiResponse<User>>(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id: string, body: Partial<User>): Promise<User> => {
  const res = await api.put<ApiResponse<User>>(`/users/${id}`, body);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const createCoach = async (body: {
  email: string; password: string; fullName: string;
  specializations?: string[]; certifications?: string[]; bio?: string;
}) => {
  const res = await api.post<ApiResponse<{ user: User }>>('/users/coaches', body);
  return res.data;
};

export const createAdmin = async (body: { email: string; password: string; fullName: string }) => {
  const res = await api.post<ApiResponse<{ user: User }>>('/users/admins', body);
  return res.data;
};
