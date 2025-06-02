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

/** @typedef {import('./meal').Meal} Meal */

// Коллекция "meals"
const mealsCollection = collection(db, "meals");

/**
 * Считает суммарные калории по списку продуктов
 * @param {Array<{calories:number, quantity:number}>} foods
 * @returns {number}
 */
const calculateTotalCalories = (foods) =>
  foods.reduce((sum, food) => sum + food.calories * food.quantity, 0);

/**
 * Добавляет приём пищи в Firestore с подсчётом калорий
 * @param {Meal} meal
 * @returns {Promise<Meal & {id: string}>}
 */
export async function addMeal(meal) {
  const mealWithTotal = {
    ...meal,
    totalCalories: calculateTotalCalories(meal.foods),
  };

  const docRef = await addDoc(mealsCollection, mealWithTotal);
  return { id: docRef.id, ...mealWithTotal };
}

/**
 * Получает все приёмы пищи пользователя
 * @param {string} userId
 * @returns {Promise<Meal[]>}
 */
export async function getMealsByUser(userId) {
  const q = query(mealsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Получает приёмы пищи пользователя по дате
 * @param {string} userId
 * @param {string} date - формат 'YYYY-MM-DD'
 * @returns {Promise<Meal[]>}
 */
export async function getMealsByDate(userId, date) {
  const q = query(
    mealsCollection,
    where("userId", "==", userId),
    where("date", "==", date)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Подписка на изменения в приёмах пищи пользователя (реактивный паттерн)
 * @param {string} userId
 * @param {(meals: Meal[]) => void} callback
 * @returns {() => void} Функция отписки
 */
export function subscribeToUserMeals(userId, callback) {
  const q = query(mealsCollection, where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const meals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(meals);
  });
}

/**
 * Обновляет приём пищи по ID с подсчётом калорий
 * @param {string} mealId
 * @param {Partial<Meal>} updatedData
 * @returns {Promise<void>}
 */
export async function updateMeal(mealId, updatedData) {
  const mealRef = doc(db, "meals", mealId);
  await updateDoc(mealRef, {
    ...updatedData,
    totalCalories: calculateTotalCalories(updatedData.foods || []),
  });
}

/**
 * Удаляет приём пищи по ID
 * @param {string} mealId
 * @returns {Promise<void>}
 */
export async function deleteMeal(mealId) {
  await deleteDoc(doc(db, "meals", mealId));
}

/** Типы приёмов пищи */
export const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
