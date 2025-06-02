import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const MealsContext = createContext();

/**
 * Провайдер, который хранит массив приёмов (meals) в стейте
 * и синхронизирует его с localStorage.
 */
export function MealsProvider({ children }) {
  const { user } = useAuth();
  const [allMeals, setAllMeals] = useState([]); // весь массив из localStorage
  const [userMeals, setUserMeals] = useState([]); // только для текущего user

  const storageKey = "meals";

  // при монтировании – читаем из localStorage
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

  // когда меняется user или allMeals – обновляем userMeals
  useEffect(() => {
    if (!user) {
      setUserMeals([]);
      return;
    }
    const filtered = allMeals.filter((m) => m.userId === user.uid);
    setUserMeals(filtered);
  }, [allMeals, user]);

  // Записываем в localStorage и обновляем allMeals
  const syncMeals = (newAllMeals) => {
    setAllMeals(newAllMeals);
    localStorage.setItem(storageKey, JSON.stringify(newAllMeals));
  };

  /**
   * Добавляет новый приём в хранилище
   * @param {{ date:string, type:string, foods: { name:string, calories:number, quantity:number }[] }} mealData
   */
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

  /**
   * Обновляет приём с данным id
   * @param {string} id
   * @param {{ date:string, type:string, foods:{ name:string, calories:number, quantity:number }[] }} updatedData
   */
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

  /**
   * Удаляет приём по id
   * @param {string} id
   */
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

/** Хук для доступа к контексту */
export const useMeals = () => useContext(MealsContext);
