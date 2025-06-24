import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMeals } from "../../contexts/MealsContext";
import {
  FiPlus,
  FiFilter,
  FiX,
  FiClock,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";
import { MealTypePill } from "../../components/ui/Pills/Pills";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/ui/Buttons/Buttons";
import { Card } from "../../components/ui/Card/Card";
import MealsFilter from "../../components/Meal/MealsFilter/MealsFilter";
import AddMealForm from "../../components/Meal/AddMealForm/AddMealForm";
import MealsTable from "../../components/MealsTable/MealsTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Meals.css";

export default function Meals({ initialMode }) {
  const { user } = useAuth();
  const { meals, addMeal, updateMeal, deleteMeal } = useMeals();

  const [filteredMeals, setFilteredMeals] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [filters, setFilters] = useState({ date: "", type: "" });
  const [showForm, setShowForm] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [stats, setStats] = useState({
    totalCalories: 0,
    mealCount: 0,
  });

  useEffect(() => {
    if (initialMode === "new") {
      setEditingMeal(null);
      setShowForm(true);
    }
  }, [initialMode]);

  useEffect(() => {
    const filtered = meals
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

    setFilteredMeals(filtered);

    // Calculate stats
    const totalCalories = filtered.reduce(
      (sum, meal) => sum + (meal.totalCalories || 0),
      0
    );
    setStats({
      totalCalories,
      mealCount: filtered.length,
    });

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
      <header className="meals-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="accent-text">Nutrition</span> Journal
          </h1>
          <p className="page-subtitle">Track your health journey</p>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon-container">
              <FiClock className="stat-icon" />
            </div>
            <div>
              <span className="stat-value">{stats.mealCount}</span>
              <span className="stat-label">Meals</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-container">
              <FiTrendingUp className="stat-icon" />
            </div>
            <div>
              <span className="stat-value">{stats.totalCalories}</span>
              <span className="stat-label">Calories</span>
            </div>
          </div>
        </div>
      </header>

      <div className="controls-section">
        <Card className="filters-card">
          <div className="controls-header">
            <div className="section-title">
              <div className="section-icon">
                <FiFilter />
              </div>
              <h3>Filter Meals</h3>
              {activeFilters > 0 && (
                <span className="filter-badge">{activeFilters}</span>
              )}
            </div>
            <SecondaryButton onClick={handleClearFilters} small>
              Clear All
            </SecondaryButton>
          </div>

          <MealsFilter filters={filters} onFilterChange={handleFilterChange} />
        </Card>
      </div>

      <div className="action-section">
        <PrimaryButton
          onClick={toggleForm}
          icon={showForm ? <FiX /> : <FiPlus />}
          className="floating-action-btn"
        >
          {showForm ? "Cancel" : "Add Meal"}
        </PrimaryButton>
      </div>

      {showForm && (
        <Card className="form-section slide-in">
          <div className="form-header">
            <h3>{editingMeal ? "Edit Meal" : "Log New Meal"}</h3>
            {editingMeal && <MealTypePill type={editingMeal.type} />}
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
        </Card>
      )}

      <div className="meals-list-section">
        <div className="section-header">
          <h3>Your Meal History</h3>
          <span className="results-count">
            Showing {filteredMeals.length} of {meals.length} entries
          </span>
        </div>

        <Card className="meals-card">
          <MealsTable
            meals={filteredMeals}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      </div>
    </div>
  );
}
