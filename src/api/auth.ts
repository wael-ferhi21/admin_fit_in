import { api, saveToken, clearToken } from './client';
import type { ApiResponse, AuthResponse } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
  saveToken(res.data.token);
  return res.data;
}

export async function logout(): Promise<void> {
  try { await api.post('/auth/logout', {}); } catch { /* ignore */ }
  clearToken();
}

export async function getMe() {
  const res = await api.get<ApiResponse<AuthResponse['user']>>('/auth/me');
  return res.data;
}
