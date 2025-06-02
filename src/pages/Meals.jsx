import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  addMeal,
  subscribeToUserMeals,
  deleteMeal,
  updateMeal,
  mealTypes,
} from "../services/mealService";
import AddMealForm from "../components/AddMealForm";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    color: "#333",
    fontSize: "24px",
    marginBottom: "20px",
  },
  filters: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
  },
  filterHeading: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  select: {
    padding: "8px",
    marginRight: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  input: {
    padding: "8px",
    marginRight: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  mealCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  mealCardHeading: {
    marginTop: 0,
    color: "#333",
  },
  mealCardParagraph: {
    marginBottom: "10px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    padding: "5px 0",
    borderBottom: "1px solid #eee",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  deleteButtonHover: {
    backgroundColor: "#c82333",
  },
};

export default function Meals() {
  const { currentUser } = useAuth();
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [filters, setFilters] = useState({ date: "", type: "" });
  const [hoveredBtnId, setHoveredBtnId] = useState(null);

  // Подписка на данные
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserMeals(currentUser.uid, (meals) => {
      setMeals(meals);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Фильтрация приёмов пищи
  useEffect(() => {
    const filtered = meals.filter((meal) => {
      return (
        (!filters.date || meal.date === filters.date) &&
        (!filters.type || meal.type === filters.type)
      );
    });
    setFilteredMeals(filtered);
  }, [meals, filters]);

  const handleAddMeal = useCallback(
    async (meal) => {
      if (!currentUser) return;
      try {
        await addMeal({
          ...meal,
          userId: currentUser.uid,
        });
      } catch (error) {
        console.error("Ошибка при добавлении:", error);
      }
    },
    [currentUser]
  );

  const handleEdit = useCallback((meal) => {
    setEditingMeal(meal);
  }, []);

  const handleUpdateMeal = useCallback(
    async (updatedMeal) => {
      if (!currentUser || !editingMeal) return;
      try {
        await updateMeal(editingMeal.id, {
          ...updatedMeal,
          userId: currentUser.uid,
        });
        setEditingMeal(null);
      } catch (error) {
        console.error("Ошибка при обновлении:", error);
      }
    },
    [currentUser, editingMeal]
  );

  const handleDelete = useCallback(async (mealId) => {
    try {
      await deleteMeal(mealId);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  }, []);

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [setFilters]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({ date: "", type: "" });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Мои приёмы пищи</h2>

      {/* Фильтры */}
      <div style={styles.filters}>
        <h3 style={styles.filterHeading}>Фильтры</h3>
        <select
          style={styles.select}
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          <option value="">Все типы</option>
          {mealTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleClearFilters}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.buttonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.button.backgroundColor)
          }
        >
          Сбросить фильтры
        </button>
      </div>

      {/* Форма добавления / редактирования */}
      <AddMealForm
        onAdd={handleAddMeal}
        meal={editingMeal}
        onUpdate={handleUpdateMeal}
      />

      {/* Список приёмов пищи */}
      <div>
        {filteredMeals.map((meal) => (
          <div key={meal.id} style={styles.mealCard}>
            <h3 style={styles.mealCardHeading}>
              {meal.type} - {meal.date}
            </h3>
            <p style={styles.mealCardParagraph}>
              Всего калорий: {meal.totalCalories}
            </p>
            <ul style={styles.list}>
              {meal.foods.map((food, index) => (
                <li key={index} style={styles.listItem}>
                  {food.name} - {food.calories} ккал × {food.quantity}
                </li>
              ))}
            </ul>
            <button
              style={styles.button}
              onClick={() => handleEdit(meal)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.buttonHover.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.button.backgroundColor)
              }
            >
              Редактировать
            </button>
            <button
              style={{ ...styles.button, ...styles.deleteButton }}
              onClick={() => handleDelete(meal.id)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.deleteButtonHover.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.deleteButton.backgroundColor)
              }
            >
              Удалить
            </button>
          </div>
        ))}
        {filteredMeals.length === 0 && <p>Нет данных по приёмам пищи</p>}
      </div>
    </div>
  );
}
