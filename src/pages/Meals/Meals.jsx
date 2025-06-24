import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMeals } from "../../contexts/MealsContext";
import { FiPlus, FiFilter, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import MealsFilter from "../../components/MealsFilter/MealsFilter";
import AddMealForm from "../../components/AddMealForm/AddMealForm";
import MealsTable from "../../components/MealsTable/MealsTable";
import "./Meals.css";

export default function Meals({ initialMode }) {
  const { user } = useAuth();
  const { meals, addMeal, updateMeal, deleteMeal } = useMeals();

  const [filteredMeals, setFilteredMeals] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [filters, setFilters] = useState({ date: "", type: "" });
  const [showForm, setShowForm] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    if (initialMode === "new") {
      setEditingMeal(null);
      setShowForm(true);
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

    // Calculate active filters count
    let count = 0;
    if (filters.date) count++;
    if (filters.type) count++;
    setActiveFilters(count);
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
      setShowForm(false);
    },
    [addMeal]
  );

  const handleUpdate = useCallback(
    (data) => {
      if (!editingMeal) return;
      updateMeal(editingMeal.id, data);
      setEditingMeal(null);
      setShowForm(false);
    },
    [updateMeal, editingMeal]
  );

  const handleDelete = useCallback(
    (id) => {
      deleteMeal(id);
      if (editingMeal && editingMeal.id === id) {
        setEditingMeal(null);
        setShowForm(false);
      }
    },
    [deleteMeal, editingMeal]
  );

  const handleEdit = useCallback((meal) => {
    setEditingMeal(meal);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEditingMeal(null);
    }
  };

  return (
    <div className="meals-container">
      <div className="meals-header">
        <div className="header-content">
          <h1>
            <span className="accent-text">My</span> Meals
          </h1>
          <p>Track and manage your nutrition</p>
        </div>

        <button
          className={`primary-btn ${showForm ? "cancel" : "add"}`}
          onClick={toggleForm}
        >
          {showForm ? <FiX size={18} /> : <FiPlus size={18} />}
          {showForm ? "Cancel" : "Add Meal"}
        </button>
      </div>

      <div className="controls-section">
        <div className="filters-container">
          <div className="filters-header">
            <FiFilter size={18} />
            <h3>Filters</h3>
            {activeFilters > 0 && (
              <span className="filter-badge">{activeFilters}</span>
            )}
          </div>

          <MealsFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>
      </div>

      {showForm && (
        <div className="form-section slide-in">
          <div className="form-header">
            <h2>{editingMeal ? "Edit Meal" : "Log New Meal"}</h2>
          </div>
          <AddMealForm
            onAdd={handleAdd}
            meal={editingMeal}
            onUpdate={handleUpdate}
            onCancel={() => {
              setShowForm(false);
              setEditingMeal(null);
            }}
          />
        </div>
      )}

      <div className="meals-list-section">
        <div className="section-header">
          <h3>Your Meal History</h3>
          <span className="results-count">{filteredMeals.length} entries</span>
        </div>

        <MealsTable
          meals={filteredMeals}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
