import { useState, useEffect } from "react";
import {
  addMeal,
  getUserMeals,
  getMealTypes,
} from "../services/firebaseConfig";
import { auth } from "../services/firebaseConfig";

const MealManager = () => {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    date: new Date().toISOString().split("T")[0], // Сегодняшняя дата
    type: "breakfast",
    foods: [],
    totalCalories: 0,
  });
  const [currentFood, setCurrentFood] = useState({
    name: "",
    calories: 0,
    quantity: 1,
  });

  // Загрузка meals при изменении даты
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = getUserMeals(
      auth.currentUser.uid,
      newMeal.date,
      (querySnapshot) => {
        const loadedMeals = [];
        querySnapshot.forEach((doc) => {
          loadedMeals.push({ id: doc.id, ...doc.data() });
        });
        setMeals(loadedMeals);
      }
    );

    return () => unsubscribe();
  }, [newMeal.date]);

  const addFoodToMeal = () => {
    if (!currentFood.name || currentFood.calories <= 0) return;

    const updatedFoods = [...newMeal.foods, currentFood];
    const updatedCalories = updatedFoods.reduce(
      (sum, food) => sum + food.calories * food.quantity,
      0
    );

    setNewMeal({
      ...newMeal,
      foods: updatedFoods,
      totalCalories: updatedCalories,
    });

    setCurrentFood({ name: "", calories: 0, quantity: 1 });
  };

  const saveMeal = async () => {
    if (!auth.currentUser || newMeal.foods.length === 0) return;

    try {
      await addMeal({
        userId: auth.currentUser.uid,
        date: newMeal.date,
        type: newMeal.type,
        foods: newMeal.foods,
        totalCalories: newMeal.totalCalories,
      });

      // Сброс формы после сохранения
      setNewMeal({
        ...newMeal,
        foods: [],
        totalCalories: 0,
      });
    } catch (error) {
      console.error("Error adding meal: ", error);
    }
  };

  return (
    <div className="meal-manager">
      <h2>Управление приемами пищи</h2>

      <div className="date-selector">
        <label>Дата: </label>
        <input
          type="date"
          value={newMeal.date}
          onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
        />
      </div>

      <div className="meal-type">
        <label>Тип приема пищи: </label>
        <select
          value={newMeal.type}
          onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
        >
          {getMealTypes().map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="food-input">
        <h3>Добавить продукт:</h3>
        <input
          type="text"
          placeholder="Название"
          value={currentFood.name}
          onChange={(e) =>
            setCurrentFood({ ...currentFood, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Калории"
          value={currentFood.calories}
          onChange={(e) =>
            setCurrentFood({ ...currentFood, calories: Number(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Количество"
          value={currentFood.quantity}
          onChange={(e) =>
            setCurrentFood({ ...currentFood, quantity: Number(e.target.value) })
          }
          min="1"
        />
        <button onClick={addFoodToMeal}>Добавить продукт</button>
      </div>

      <div className="current-meal">
        <h3>Текущий прием пищи ({newMeal.type}):</h3>
        <ul>
          {newMeal.foods.map((food, index) => (
            <li key={index}>
              {food.quantity}x {food.name} - {food.calories * food.quantity}{" "}
              ккал
            </li>
          ))}
        </ul>
        <p>Всего калорий: {newMeal.totalCalories}</p>
        <button onClick={saveMeal}>Сохранить прием пищи</button>
      </div>

      <div className="meals-list">
        <h3>Сохраненные приемы пищи:</h3>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-item">
            <h4>
              {meal.type} ({meal.date})
            </h4>
            <p>Всего калорий: {meal.totalCalories}</p>
            <ul>
              {meal.foods.map((food, index) => (
                <li key={index}>
                  {food.quantity}x {food.name} - {food.calories * food.quantity}{" "}
                  ккал
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealManager;
