import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { subscribeToUserMeals } from "../services/mealService";
import { Pie } from "react-chartjs-2";

export default function Stats() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    daily: 0,
    weekly: 0,
    byType: {},
  });

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserMeals(currentUser.uid, (meals) => {
      const today = new Date().toISOString().slice(0, 10);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const newStats = {
        daily: 0,
        weekly: 0,
        byType: {},
      };

      meals.forEach((meal) => {
        if (meal.date === today) {
          newStats.daily += meal.totalCalories;
        }

        const mealDate = new Date(meal.date);
        if (mealDate >= weekAgo) {
          newStats.weekly += meal.totalCalories;
        }

        if (!newStats.byType[meal.type]) {
          newStats.byType[meal.type] = 0;
        }
        newStats.byType[meal.type] += meal.totalCalories;
      });

      setStats(newStats);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const chartData = {
    labels: Object.keys(stats.byType),
    datasets: [
      {
        data: Object.values(stats.byType),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="stats">
      <h2>Статистика</h2>
      <div className="stat-cards">
        <div className="stat-card">
          <h3>Сегодня</h3>
          <p>{stats.daily} ккал</p>
        </div>
        <div className="stat-card">
          <h3>За неделю</h3>
          <p>{stats.weekly} ккал</p>
        </div>
      </div>

      <h3>По типам приёмов пищи</h3>
      <div style={{ width: "400px", height: "400px" }}>
        <Pie data={chartData} />
      </div>
    </div>
  );
}
