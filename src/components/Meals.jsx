import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  addMeal,
  subscribeToUserMeals,
  deleteMeal,
  mealTypes,
} from "../firebase/mealService";

export default function Meals() {
  const { currentUser } = useAuth();
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    type: "breakfast",
    foods: [{ name: "", calories: 0, quantity: 1 }],
    date: new Date().toISOString().slice(0, 10),
  });

  // Подписка на данные
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserMeals(currentUser.uid, (meals) => {
      setMeals(meals);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddMeal = async () => {
    if (!currentUser) return;

    try {
      await addMeal({
        ...newMeal,
        userId: currentUser.uid,
      });
      // Сброс формы
      setNewMeal({
        type: "breakfast",
        foods: [{ name: "", calories: 0, quantity: 1 }],
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    }
  };

  const handleDelete = async (mealId) => {
    try {
      await deleteMeal(mealId);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  return (
    <div className="meals-container">
      <h2>Мои приёмы пищи</h2>

      {/* Форма добавления */}
      <div className="add-meal-form">
        <h3>Добавить приём пищи</h3>
        <div>
          <label>
            Дата:
            <input
              type="date"
              value={newMeal.date}
              onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Тип:
            <select
              value={newMeal.type}
              onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
            >
              {mealTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Поля для продуктов */}
        {newMeal.foods.map((food, index) => (
          <div key={index} className="food-item">
            <input
              placeholder="Название"
              value={food.name}
              onChange={(e) => {
                const newFoods = [...newMeal.foods];
                newFoods[index].name = e.target.value;
                setNewMeal({ ...newMeal, foods: newFoods });
              }}
            />
            <input
              type="number"
              placeholder="Калории"
              value={food.calories}
              onChange={(e) => {
                const newFoods = [...newMeal.foods];
                newFoods[index].calories = Number(e.target.value);
                setNewMeal({ ...newMeal, foods: newFoods });
              }}
            />
            <input
              type="number"
              placeholder="Количество"
              value={food.quantity}
              onChange={(e) => {
                const newFoods = [...newMeal.foods];
                newFoods[index].quantity = Number(e.target.value);
                setNewMeal({ ...newMeal, foods: newFoods });
              }}
            />
          </div>
        ))}

        <button
          onClick={() =>
            setNewMeal({
              ...newMeal,
              foods: [...newMeal.foods, { name: "", calories: 0, quantity: 1 }],
            })
          }
        >
          + Добавить продукт
        </button>

        <button onClick={handleAddMeal}>Сохранить приём пищи</button>
      </div>

      {/* Список приёмов пищи */}
      <div className="meals-list">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <h3>
              {meal.type} - {meal.date}
            </h3>
            <p>Всего калорий: {meal.totalCalories}</p>
            <ul>
              {meal.foods.map((food, index) => (
                <li key={index}>
                  {food.name} - {food.calories} ккал × {food.quantity}
                </li>
              ))}
            </ul>
            <button onClick={() => handleDelete(meal.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
