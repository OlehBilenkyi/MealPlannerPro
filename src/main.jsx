import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { MealsProvider } from "./contexts/MealsContext";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MealsProvider>
        <App />
      </MealsProvider>
    </AuthProvider>
  </React.StrictMode>
);
