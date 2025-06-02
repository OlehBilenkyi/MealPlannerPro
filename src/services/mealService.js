// src/firebase/mealService.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Добавление приёма пищи
export const addMeal = async (meal) => {
  const mealWithTotal = {
    ...meal,
    totalCalories: calculateTotalCalories(meal.foods),
  };

  const docRef = await addDoc(collection(db, "meals"), mealWithTotal);
  return { id: docRef.id, ...mealWithTotal };
};

// Получение всех приёмов пищи пользователя
export const getMealsByUser = async (userId) => {
  const q = query(collection(db, "meals"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Реальное обновление данных (подписка)
export const subscribeToUserMeals = (userId, callback) => {
  const q = query(collection(db, "meals"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const meals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(meals);
  });
};

// Обновление приёма пищи
export const updateMeal = async (mealId, updatedData) => {
  const mealRef = doc(db, "meals", mealId);
  await updateDoc(mealRef, {
    ...updatedData,
    totalCalories: calculateTotalCalories(updatedData.foods),
  });
};

// Удаление приёма пищи
export const deleteMeal = async (mealId) => {
  await deleteDoc(doc(db, "meals", mealId));
};

// Вспомогательная функция для подсчёта калорий
const calculateTotalCalories = (foods) => {
  return foods.reduce((sum, food) => sum + food.calories * food.quantity, 0);
};

// Типы приёмов пищи
export const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
