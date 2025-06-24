import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMeals } from "../../contexts/MealsContext";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiCalendar,
  FiPieChart,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { meals } = useMeals();
  const [todayCount, setTodayCount] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);

  useEffect(() => {
    if (!user) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    let tCount = 0,
      tCal = 0,
      wCal = 0;

    meals.forEach((meal) => {
      if (meal.date === todayStr) {
        tCount += 1;
        tCal += meal.totalCalories;
      }
      const mealDateObj = new Date(meal.date);
      if (mealDateObj >= weekAgo) {
        wCal += meal.totalCalories;
      }
    });

    setTodayCount(tCount);
    setTodayCalories(tCal);
    setWeeklyCalories(wCal);

    // Goal
    const settingsRaw = localStorage.getItem(`userSettings_${user.uid}`);
    if (settingsRaw) {
      try {
        const parsed = JSON.parse(settingsRaw);
        if (!isNaN(Number(parsed.dailyCalorieGoal))) {
          setDailyGoal(Number(parsed.dailyCalorieGoal));
        }
      } catch {
        // leave default
      }
    }
  }, [user, meals]);

  const progressPercent = Math.min(
    100,
    Math.round((todayCalories / dailyGoal) * 100)
  );

  // 3 most recent meals
  const sortedByDateDesc = [...meals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const recentMeals = sortedByDateDesc.slice(0, 3);

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
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          <span className="welcome-text">Welcome back,</span>
          <span className="username">{user?.displayName || user?.email}</span>
        </h1>
        <p className="subtitle">Here's your nutrition overview</p>
      </header>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/meals" className="action-btn secondary">
          <FiCalendar /> View All
        </Link>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <h3>Today's Meals</h3>
            <p className="stat-value">{todayCount}</p>
            <p className="stat-label">items recorded</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiActivity />
          </div>
          <div className="stat-content">
            <h3>Calories Today</h3>
            <p className="stat-value">
              {todayCalories} <span>/ {dailyGoal} kcal</span>
            </p>
            <div className="progress-wrapper">
              <div
                className="progress-fill"
                style={{
                  width: `${progressPercent}%`,
                  background:
                    progressPercent > 100
                      ? "linear-gradient(90deg, #ff7675, #d63031)"
                      : "linear-gradient(90deg, #00b894, #55efc4)",
                }}
              />
            </div>
            <p className="progress-text">{progressPercent}% of daily goal</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiPieChart />
          </div>
          <div className="stat-content">
            <h3>Weekly Intake</h3>
            <p className="stat-value">{weeklyCalories}</p>
            <p className="stat-label">kcal this week</p>
          </div>
        </div>
      </div>

      {/* Recent Meals */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Meals</h2>
          <Link to="/meals" className="view-all">
            View All <FiCalendar />
          </Link>
        </div>

        {recentMeals.length === 0 ? (
          <div className="empty-state">
            <FiClock size={48} className="empty-icon" />
            <h3>No meals recorded yet</h3>
            <p>Add your first meal to get started</p>
          </div>
        ) : (
          <div className="recent-meals-grid">
            {recentMeals.map((meal) => (
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

                <div className="food-items">
                  {meal.foods.slice(0, 2).map((food, index) => (
                    <div key={index} className="food-item">
                      <span className="food-name">{food.name}</span>
                      <span className="food-details">
                        {food.quantity}x • {food.calories * food.quantity}kcal
                      </span>
                    </div>
                  ))}
                  {meal.foods.length > 2 && (
                    <div className="more-items">
                      +{meal.foods.length - 2} more items
                    </div>
                  )}
                </div>

                <Link to={`/meals#${meal.id}`} className="view-btn">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
