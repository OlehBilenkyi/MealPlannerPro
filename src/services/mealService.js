export const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

const STORAGE_KEY = "meals";

export const getUserMeals = async (userId) => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return data.filter((meal) => meal.userId === userId);
};

export const addMeal = async (meal) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const newMeal = { id: Date.now().toString(), ...meal };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newMeal]));
  return newMeal;
};

export const deleteMeal = async (mealId) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const updated = existing.filter((meal) => meal.id !== mealId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateMeal = async (mealId, updatedData) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const updatedMeals = existing.map((meal) =>
    meal.id === mealId ? { ...meal, ...updatedData } : meal
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeals));
};

export const subscribeToUserMeals = (userId, callback) => {
  const loadData = () => {
    const allMeals = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const userMeals = allMeals.filter((m) => m.userId === userId);
    callback(userMeals);
  };

  loadData();

  const interval = setInterval(loadData, 1000);
  return () => clearInterval(interval);
};
