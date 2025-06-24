// src/types/meal.ts
export interface FoodItem {
  name: string;
  calories: number;
  quantity: number;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  userId: string;
  date: string; // ISO string format
  type: MealType;
  foods: FoodItem[];
  totalCalories: number;
}