import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addMeal, subscribeToUserMeals } from "../services/mealService";
import AddMealForm from "../components/Meal/AddMealForm";
import { FiPlus, FiCalendar, FiClock } from "react-icons/fi";
import "./MealManager.css";

const MealManager = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [activeTab, setActiveTab] = useState("add");

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="meal-manager-container">
      <div className="meal-manager-header">
        <h1>
          <span className="accent-text">Meal</span> Tracker
        </h1>
        <p>Manage your nutrition intake</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          <FiPlus /> Add Meal
        </button>
        <button
          className={`tab-btn ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          <FiCalendar /> My Meals
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "add" ? (
          <div className="add-meal-section">
            <AddMealForm onAdd={handleAddMeal} />
          </div>
        ) : (
          <div className="meals-list-section">
            {meals.length === 0 ? (
              <div className="empty-state">
                <FiClock size={48} className="empty-icon" />
                <h3>No meals recorded yet</h3>
                <p>Add your first meal to get started</p>
              </div>
            ) : (
              <div className="meals-grid">
                {meals.map((meal) => (
                  <div key={meal.id} className="meal-card">
                    <div className="meal-header">
                      <span className={`meal-type ${meal.type.toLowerCase()}`}>
                        {meal.type}
                      </span>
                      <span className="meal-date">{formatDate(meal.date)}</span>
                    </div>

                    <div className="calories-badge">
                      {meal.totalCalories} <span>kcal</span>
                    </div>

                    <ul className="food-items">
                      {meal.foods.slice(0, 3).map((food, index) => (
                        <li key={index} className="food-item">
                          <span className="food-name">{food.name}</span>
                          <span className="food-details">
                            {food.quantity}x • {food.calories * food.quantity}
                            kcal
                          </span>
                        </li>
                      ))}
                      {meal.foods.length > 3 && (
                        <li className="more-items">
                          +{meal.foods.length - 3} more items
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealManager;
