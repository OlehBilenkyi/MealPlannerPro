import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMeals } from "../../contexts/MealsContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import { FiPieChart, FiCalendar, FiTrendingUp, FiAward } from "react-icons/fi";
import "./Stats.css";

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
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      title: {
        display: true,
        text: "Calories by Meal Type",
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 600,
        },
        color: "var(--color-dark)",
        padding: { top: 10, bottom: 20 },
      },
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        titleFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
      },
    },
    maintainAspectRatio: false,
    cutout: "60%",
  };

  const progressPercent = Math.min(
    100,
    Math.round((todayCalories / dailyGoal) * 100)
  );

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1 className="stats-title">
          <FiPieChart className="stats-icon" />
          Nutrition Statistics
        </h1>
        <p className="stats-subtitle">Track your eating habits and progress</p>
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <div className="card-icon">
            <FiCalendar size={24} />
          </div>
          <h3 className="card-title">Today's Meals</h3>
          <p className="card-value">{dailyCount}</p>
          <p className="card-label">meals logged</p>
        </div>

        <div className="stats-card">
          <div className="card-icon">
            <FiAward size={24} />
          </div>
          <h3 className="card-title">Daily Calories</h3>
          <p className="card-value">
            {todayCalories} <span> / {dailyGoal} kcal</span>
          </p>
          <div className="progress-container">
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor:
                    progressPercent > 100
                      ? "var(--color-danger)"
                      : "var(--color-primary)",
                }}
              />
            </div>
            <span className="progress-percent">{progressPercent}%</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="card-icon">
            <FiTrendingUp size={24} />
          </div>
          <h3 className="card-title">Weekly Total</h3>
          <p className="card-value">{weekCalories}</p>
          <p className="card-label">calories</p>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-wrapper">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}
