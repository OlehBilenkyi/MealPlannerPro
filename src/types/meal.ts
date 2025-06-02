export type FoodItem = {
  name: string,
  calories: number,
  quantity: number,
};

export type Meal = {
  id?: string, // Будет автоматически генерироваться Firestore
  userId: string,
  date: string, // Формат: 'YYYY-MM-DD'
  type: "breakfast" | "lunch" | "dinner" | "snack",
  foods: FoodItem[],
  totalCalories: number,
};
