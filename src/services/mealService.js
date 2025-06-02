// src/services/mealService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

/**
 * Добавляет новый приём пищи в Firestore.
 * @param {{ userId: string, date: string, type: string, foods: Array<{name:string,calories:number,quantity:number}>, totalCalories: number }} meal
 * @returns {Promise<string>} возвращает автоматически сгенерированный id документа
 */
export const addMeal = async (meal) => {
  // коллекция "meals"
  const mealsRef = collection(db, "meals");
  // addDoc возвращает DocumentReference, у него есть .id
  const docRef = await addDoc(mealsRef, {
    userId: meal.userId,
    date: meal.date,
    type: meal.type,
    foods: meal.foods,
    totalCalories: meal.totalCalories,
    createdAt: new Date(), // можно хранить время создания
  });
  return docRef.id;
};

/**
 * Удаляет приём пищи с указанным id (удаляется документ из Firestore).
 * @param {string} mealId
 * @returns {Promise<void>}
 */
export const deleteMeal = async (mealId) => {
  const mealDocRef = doc(db, "meals", mealId);
  await deleteDoc(mealDocRef);
};

/**
 * Обновляет приём пищи с указанным id.
 * @param {string} mealId
 * @param {{ userId: string, date: string, type: string, foods: Array<{name:string,calories:number,quantity:number}>, totalCalories: number }} updatedData
 * @returns {Promise<void>}
 */
export const updateMeal = async (mealId, updatedData) => {
  const mealDocRef = doc(db, "meals", mealId);
  await updateDoc(mealDocRef, {
    date: updatedData.date,
    type: updatedData.type,
    foods: updatedData.foods,
    totalCalories: updatedData.totalCalories,
    userId: updatedData.userId,
    updatedAt: new Date(),
  });
};

/**
 * Возвращает все приёмы пищи для заданного userId (одноразово, без подписки).
 * Можно использовать, если нужно получить единоразовый снэпшот.
 * @param {string} userId
 * @returns {Promise<Array<Object>>} массив объектов {id, userId, date, type, foods, totalCalories}
 */
export const getUserMeals = async (userId) => {
  const mealsRef = collection(db, "meals");
  const q = query(mealsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const meals = [];
  snapshot.forEach((docSnap) => {
    meals.push({ id: docSnap.id, ...docSnap.data() });
  });
  return meals;
};

/**
 * Подписывается на изменения в коллекции "meals" для конкретного userId.
 * Всюкий раз, когда добавляется/обновляется/удаляется документ, вызывается callback(mealsArray).
 * @param {string} userId
 * @param {(meals: Array<Object>) => void} callback
 * @returns {() => void} функцию, которую нужно вызвать для отписки
 */
export const subscribeToUserMeals = (userId, callback) => {
  const mealsRef = collection(db, "meals");
  const q = query(mealsRef, where("userId", "==", userId));

  // onSnapshot возвращает функцию unsubscribe
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const meals = [];
    querySnapshot.forEach((docSnap) => {
      meals.push({ id: docSnap.id, ...docSnap.data() });
    });
    callback(meals);
  });

  return unsubscribe;
};
