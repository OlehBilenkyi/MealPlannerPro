import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const MealsContext = createContext();

export function MealsProvider({ children }) {
  const { user } = useAuth();
  const [allMeals, setAllMeals] = useState([]);
  const [userMeals, setUserMeals] = useState([]);

  const storageKey = "meals";

  useEffect(() => {
    const raw = localStorage.getItem(storageKey) || "[]";
    let parsed = [];
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = [];
    }
    setAllMeals(parsed);
  }, []);

  useEffect(() => {
    if (!user) {
      setUserMeals([]);
      return;
    }
    const filtered = allMeals.filter((m) => m.userId === user.uid);
    setUserMeals(filtered);
  }, [allMeals, user]);

  const syncMeals = (newAllMeals) => {
    setAllMeals(newAllMeals);
    localStorage.setItem(storageKey, JSON.stringify(newAllMeals));
  };

  const addMeal = (mealData) => {
    if (!user) return;
    const totalCalories = mealData.foods.reduce(
      (sum, f) => sum + f.calories * f.quantity,
      0
    );
    const newMeal = {
      id: Date.now().toString(),
      userId: user.uid,
      date: mealData.date,
      type: mealData.type,
      foods: mealData.foods,
      totalCalories,
    };
    const updated = [...allMeals, newMeal];
    syncMeals(updated);
  };

  const updateMeal = (id, updatedData) => {
    if (!user) return;
    const totalCalories = updatedData.foods.reduce(
      (sum, f) => sum + f.calories * f.quantity,
      0
    );
    const newAll = allMeals.map((m) =>
      m.id === id
        ? {
            ...m,
            date: updatedData.date,
            type: updatedData.type,
            foods: updatedData.foods,
            totalCalories,
          }
        : m
    );
    syncMeals(newAll);
  };

  const deleteMeal = (id) => {
    const newAll = allMeals.filter((m) => m.id !== id);
    syncMeals(newAll);
  };

  return (
    <MealsContext.Provider
      value={{ meals: userMeals, addMeal, updateMeal, deleteMeal }}
    >
      {children}
    </MealsContext.Provider>
  );
}

export const useMeals = () => useContext(MealsContext);
