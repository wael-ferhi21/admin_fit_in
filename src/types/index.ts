export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'Consumer' | 'Coach' | 'Admin';
  isActive: boolean;
  phoneNumber?: string;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Consumer {
  _id: string;
  userId: string;
  age: number;
  height: number;
  weight: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'athlete';
  gender: 'male' | 'female' | 'other';
  phoneNumber?: string;
  allergies: string[];
  goals: string[];
  steps: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
}

export interface CoachReview {
  userId: string;
  comment: string;
  rating: number;
}

export interface Coach {
  _id: string;
  userId: string | User;
  specializations: string[];
  certifications: string[];
  bio?: string;
  clients: string[];
  rating: number;
  reviews: CoachReview[];
  createdAt: string;
}

export interface HealthMetrics {
  _id: string;
  userId: string;
  weight: number;
  caloriesConsumed: number;
  steps: number;
  date: string;
  createdAt: string;
}

export interface Goal {
  _id: string;
  userId: string;
  targetWeight: number;
  deadline: string;
  status: 'active' | 'completed' | 'failed';
  createdAt: string;
}

export interface Recommendation {
  _id: string;
  userId: string;
  type: 'meal' | 'workout' | 'lifestyle';
  content: string;
  createdAt: string;
}

export interface Exercise {
  _id: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  notes?: string;
  videoUrl?: string;
  muscleGroup: string;
  alternative?: string;
}

export interface WorkoutSession {
  _id: string;
  name: string;
  description?: string;
  exercises: string[] | Exercise[];
  coachId: string;
  consumerIds: string[];
  intensity: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface MealPlan {
  _id: string;
  name: string;
  dailyCalories: number;
  createdBy: string;
  userId: string;
  macros: { protein: number; carbs: number; fat: number };
  startDate: string;
  endDate: string;
  meals: { date: string; mealId: string; mealType: string }[];
  createdAt: string;
}

export interface Meal {
  _id: string;
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  prepTime?: number;
  image?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  consumers: number;
  coaches: number;
  admins: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
