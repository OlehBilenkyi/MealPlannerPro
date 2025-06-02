import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  addMeal,
  subscribeToUserMeals,
  deleteMeal,
  updateMeal,
  mealTypes,
} from "../firebase/mealService";

export default function Meals() {
  const { currentUser } = useAuth();
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    type: "breakfast",
    foods: [{ name: "", calories: 0, quantity: 1 }],
    date: new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState({ date: "", foods: [] });
  const [editingMeal, setEditingMeal] = useState(null);
  const [filters, setFilters] = useState({ date: "", type: "" });

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

  const validateForm = () => {
    let isValid = true;
    const newErrors = { date: "", foods: [] };

    if (!newMeal.date) {
      newErrors.date = "Укажите дату";
      isValid = false;
    }

    newMeal.foods.forEach((food, index) => {
      newErrors.foods[index] = { name: "", calories: "" };

      if (!food.name.trim()) {
        newErrors.foods[index].name = "Введите название";
        isValid = false;
      }

      if (food.calories <= 0) {
        newErrors.foods[index].calories = "Калории должны быть > 0";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleAddMeal = async () => {
    if (!validateForm()) return;
    if (!currentUser) return;

    try {
      await addMeal({
        ...newMeal,
        userId: currentUser.uid,
      });
      setNewMeal({
        type: "breakfast",
        foods: [{ name: "", calories: 0, quantity: 1 }],
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setNewMeal({
      date: meal.date,
      type: meal.type,
      foods: [...meal.foods],
    });
  };

  const handleUpdateMeal = async () => {
    if (!validateForm()) return;

    try {
      await updateMeal(editingMeal.id, {
        ...newMeal,
        userId: currentUser.uid,
      });
      setEditingMeal(null);
      setNewMeal({
        type: "breakfast",
        foods: [{ name: "", calories: 0, quantity: 1 }],
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
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

      {/* Фильтры */}
      <div className="filters">
        <h3>Фильтры</h3>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Все типы</option>
          {mealTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />

        <button onClick={() => setFilters({ date: "", type: "" })}>
          Сбросить фильтры
        </button>
      </div>

      {/* Форма добавления */}
      <div className="add-meal-form">
        <h3>
          {editingMeal ? "Редактировать приём пищи" : "Добавить приём пищи"}
        </h3>
        <div>
          <label>
            Дата:
            <input
              type="date"
              value={newMeal.date}
              onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
            />
            {errors.date && <span className="error">{errors.date}</span>}
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
            {errors.foods[index]?.name && (
              <span className="error">{errors.foods[index].name}</span>
            )}

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
            {errors.foods[index]?.calories && (
              <span className="error">{errors.foods[index].calories}</span>
            )}

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

        {editingMeal ? (
          <button onClick={handleUpdateMeal}>Обновить приём пищи</button>
        ) : (
          <button onClick={handleAddMeal}>Сохранить приём пищи</button>
        )}
      </div>

      {/* Список приёмов пищи */}
      <div className="meals-list">
        {filteredMeals.map((meal) => (
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
            <button onClick={() => handleEdit(meal)}>Редактировать</button>
            <button onClick={() => handleDelete(meal.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
