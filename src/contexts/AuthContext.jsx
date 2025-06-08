// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Загружаем пользователя из локального хранилища при монтировании
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const register = async (email, password) => {
    // Простая регистрация без проверки пароля
    const newUser = { email, password, uid: Date.now().toString() };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setError("");
  };

  const login = async (email, password) => {
    // Простая проверка аутентификации
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.email === email && user.password === password) {
        setUser(user);
        setError("");
      } else {
        setError("Неверный email или пароль");
      }
    } else {
      setError("Пользователь не найден");
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, error, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
