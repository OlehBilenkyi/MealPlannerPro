import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMeals } from "../contexts/MealsContext";
import { Link } from "react-router-dom";

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

  return (
    <div className="container">
      <h2 className="heading">Hello, {user?.displayName || user?.email}!</h2>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="card">
          <h3>Today's Meals</h3>
          <p>{todayCount} items</p>
        </div>
        <div className="card">
          <h3>Calories Today</h3>
          <p>
            {todayCalories} / {dailyGoal} kcal
          </p>
          <div className="progress-wrapper">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor:
                  progressPercent > 100
                    ? "var(--color-danger)"
                    : "var(--color-success)",
              }}
            />
          </div>
          <small>{progressPercent}% of goal</small>
        </div>
        <div className="card">
          <h3>Calories in 7 Days</h3>
          <p>{weeklyCalories} kcal</p>
        </div>
      </div>

      {/* Recent Meals */}
      <div className="recent-meals" style={{ marginTop: "1.5rem" }}>
        <h3>Recent Meals</h3>
        {recentMeals.length === 0 && <p>No meals added</p>}
        <ul>
          {recentMeals.map((meal) => (
            <li
              key={meal.id}
              style={{
                marginBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "var(--color-white)",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                boxShadow: "var(--box-shadow)",
              }}
            >
              <span>
                {meal.date} — {meal.type} ({meal.totalCalories} kcal)
              </span>
              <Link
                to="/meals"
                className="btn btn-secondary"
                style={{ fontSize: "0.85rem" }}
              >
                Go to
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
