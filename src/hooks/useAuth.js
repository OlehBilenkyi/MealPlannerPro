// src/hooks/useAuth.js
import { useState, useCallback } from "react";
import { auth } from "../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

export const useAuth = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Обработчик для очистки ошибок
  const clearError = useCallback(() => setError(null), []);

  // Регистрация с возможностью добавления displayName
  const register = useCallback(
    async (email, password, displayName = null) => {
      setLoading(true);
      clearError();
      try {
        const { user: authUser } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (displayName) {
          await updateProfile(authUser, { displayName });
        }

        setUser(authUser);
        return authUser;
      } catch (err) {
        setError(getFriendlyError(err.code));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError]
  );

  // Вход в систему
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      clearError();
      try {
        const { user: authUser } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(authUser);
        return authUser;
      } catch (err) {
        setError(getFriendlyError(err.code));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearError]
  );

  // Выход из системы
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  }, []);

  // Подписка на изменения состояния аутентификации
  useState(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // Функция для преобразования кодов ошибок в понятные сообщения
  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Этот email уже используется";
      case "auth/invalid-email":
        return "Некорректный email";
      case "auth/weak-password":
        return "Пароль должен содержать минимум 6 символов";
      case "auth/user-not-found":
        return "Пользователь не найден";
      case "auth/wrong-password":
        return "Неверный пароль";
      default:
        return "Произошла ошибка. Пожалуйста, попробуйте снова";
    }
  };

  return {
    user,
    register,
    login,
    logout,
    error,
    clearError,
    loading,
  };
};
