import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMeals } from "../contexts/MealsContext";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function Stats() {
  const { user } = useAuth();
  const { meals } = useMeals();
  const [todayCalories, setTodayCalories] = useState(0);
  const [weekCalories, setWeekCalories] = useState(0);
  const [dailyCount, setDailyCount] = useState(0);
  const [byType, setByType] = useState({});
  const [dailyGoal, setDailyGoal] = useState(2000);

  useEffect(() => {
    if (!user) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    let tCount = 0;
    let tCal = 0;
    let wCal = 0;
    const typeMap = {};

    meals.forEach((meal) => {
      const mealDate = meal.date.slice(0, 10);
      const calories = meal.totalCalories;

      if (mealDate === todayStr) {
        tCount += 1;
        tCal += calories;
      }
      const mealDateObj = new Date(meal.date);
      if (mealDateObj >= weekAgo) {
        wCal += calories;
      }
      if (!typeMap[meal.type]) typeMap[meal.type] = 0;
      typeMap[meal.type] += calories;
    });

    setDailyCount(tCount);
    setTodayCalories(tCal);
    setWeekCalories(wCal);
    setByType(typeMap);

    const settingsRaw = localStorage.getItem(`userSettings_${user.uid}`);
    if (settingsRaw) {
      try {
        const parsed = JSON.parse(settingsRaw);
        if (!isNaN(Number(parsed.dailyCalorieGoal))) {
          setDailyGoal(Number(parsed.dailyCalorieGoal));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [user, meals]);

  const pieData = {
    labels: Object.keys(byType),
    datasets: [
      {
        data: Object.values(byType),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      title: {
        display: true,
        text: "Calories by Meal Type Over Time",
        font: { size: 18 },
      },
      legend: {
        position: "bottom",
      },
    },
    maintainAspectRatio: false,
  };

  const progressPercent = Math.min(
    100,
    Math.round((todayCalories / dailyGoal) * 100)
  );

  return (
    <div className="container">
      <h2 className="heading">Statistics</h2>

      <div className="stats-grid">
        <div className="card">
          <h3>Today's Meals</h3>
          <p>{dailyCount} items</p>
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
          <p>{weekCalories} kcal</p>
        </div>
      </div>

      <h3 style={{ marginTop: "24px" }}>By Meal Types</h3>
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "400px",
          marginTop: "16px",
        }}
      >
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
}
