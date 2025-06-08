import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMeals } from "../contexts/MealsContext";

import MealsFilter from "../components/MealsFilter";
import ActionBar from "../components/ActionBar";
import AddMealForm from "../components/AddMealForm";
import MealsTable from "../components/MealsTable";

export default function Meals({ initialMode }) {
  const { user } = useAuth();
  const { meals, addMeal, updateMeal, deleteMeal } = useMeals();

  const [filteredMeals, setFilteredMeals] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [filters, setFilters] = useState({ date: "", type: "" });

  useEffect(() => {
    if (initialMode === "new") {
      setEditingMeal(null);
    }
  }, [initialMode]);

  useEffect(() => {
    const res = meals
      .filter((meal) => {
        const mealDate = meal.date.slice(0, 10);
        const mealType = meal.type.trim().toLowerCase();
        const filterType = filters.type.trim().toLowerCase();
        return (
          (!filters.date || mealDate === filters.date) &&
          (!filters.type || mealType === filterType)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredMeals(res);
  }, [meals, filters]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ date: "", type: "" });
  }, []);

  const handleAdd = useCallback(
    (data) => {
      addMeal(data);
      setEditingMeal(null);
    },
    [addMeal]
  );

  const handleUpdate = useCallback(
    (data) => {
      if (!editingMeal) return;
      updateMeal(editingMeal.id, data);
      setEditingMeal(null);
    },
    [updateMeal, editingMeal]
  );

  const handleDelete = useCallback(
    (id) => {
      deleteMeal(id);
      if (editingMeal && editingMeal.id === id) {
        setEditingMeal(null);
      }
    },
    [deleteMeal, editingMeal]
  );

  const handleEdit = useCallback((meal) => {
    setEditingMeal(meal);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container">
      <h2 className="heading">My Meals</h2>

      <ActionBar
        onClearFilters={handleClearFilters}
        onAddMeal={() => setEditingMeal(null)}
      />

      <MealsFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <div className="form-container" style={{ marginTop: "1rem" }}>
        <h3>{editingMeal ? "Edit Meal" : "Add Meal"}</h3>
        <AddMealForm
          onAdd={handleAdd}
          meal={editingMeal}
          onUpdate={handleUpdate}
        />
      </div>

      <MealsTable
        meals={filteredMeals}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
