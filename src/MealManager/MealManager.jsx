import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addMeal } from "../services/mealService";
import AddMealForm from "./AddMealForm";

const MealManager = () => {
  const { currentUser } = useAuth();
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserMeals(currentUser.uid, (meals) => {
      setMeals(meals);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddMeal = async (mealData) => {
    if (!currentUser || mealData.foods.length === 0) return;

    try {
      await addMeal({
        ...mealData,
        userId: currentUser.uid,
        totalCalories: mealData.foods.reduce(
          (sum, food) => sum + food.calories * food.quantity,
          0
        ),
      });
    } catch (error) {
      console.error("Ошибка при добавлении приёма пищи:", error);
    }
  };

  return (
    <div className="meal-manager">
      <h2>Управление приёмами пищи</h2>

      {/* 🔽 Форма добавления */}
      <AddMealForm onAdd={handleAddMeal} />

      {/* 🔽 Список сохранённых приёмов пищи */}
      <div className="meals-list">
        <h3>Сохранённые приёмы пищи:</h3>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-item">
            <h4>
              {meal.type} — {meal.date}
            </h4>
            <p>Калории: {meal.totalCalories}</p>
            <ul>
              {meal.foods.map((food, index) => (
                <li key={index}>
                  {food.quantity}x {food.name} — {food.calories * food.quantity}{" "}
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
