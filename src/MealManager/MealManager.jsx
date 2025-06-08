// src/MealManager/MealManager.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addMeal, subscribeToUserMeals } from "../services/mealService";
import AddMealForm from "../components/AddMealForm";

const MealManager = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserMeals(user.uid, (meals) => {
      setMeals(meals);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddMeal = async (mealData) => {
    if (!user || mealData.foods.length === 0) return;

    try {
      await addMeal({
        ...mealData,
        userId: user.uid,
        totalCalories: mealData.foods.reduce(
          (sum, food) => sum + food.calories * food.quantity,
          0
        ),
      });
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  return (
    <div className="meal-manager">
      <h2>Meal Management</h2>

      {/* 🔽 Add Meal Form */}
      <AddMealForm onAdd={handleAddMeal} />

      {/* 🔽 List of Saved Meals */}
      <div className="meals-list">
        <h3>Saved Meals:</h3>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-item">
            <h4>
              {meal.type} — {meal.date}
            </h4>
            <p>Calories: {meal.totalCalories}</p>
            <ul>
              {meal.foods.map((food, index) => (
                <li key={index}>
                  {food.quantity}x {food.name} — {food.calories * food.quantity}{" "}
                  kcal
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
