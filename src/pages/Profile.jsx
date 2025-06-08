// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile, updatePassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function Profile() {
  const { user, logout } = useAuth();
  const uid = user?.uid;

  const [displayName, setDisplayName] = useState("");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const storageKey = `userSettings_${uid}`;

  useEffect(() => {
    if (!uid) return;

    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setDisplayName(parsed.displayName || user.displayName || "");
        setDailyCalorieGoal(parsed.dailyCalorieGoal?.toString() || "2000");
      } catch {
        const defaults = {
          displayName: user.displayName || "",
          dailyCalorieGoal: 2000,
        };
        localStorage.setItem(storageKey, JSON.stringify(defaults));
        setDisplayName(defaults.displayName);
        setDailyCalorieGoal("2000");
      }
    } else {
      const defaults = {
        displayName: user.displayName || "",
        dailyCalorieGoal: 2000,
      };
      localStorage.setItem(storageKey, JSON.stringify(defaults));
      setDisplayName(defaults.displayName);
      setDailyCalorieGoal("2000");
    }

    setLoading(false);
  }, [uid, user.displayName]);

  if (!user) return <p>Loading...</p>;

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    // Change password (if both fields are entered)
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      if (newPassword.length < 6) {
        setMessage("Password must be at least 6 characters long.");
        return;
      }
      try {
        await updatePassword(auth.currentUser, newPassword);
        setMessage("Password successfully changed.");
      } catch (err) {
        console.error(err);
        setMessage("Failed to change password: " + err.message);
        return;
      }
    }

    // Change display name (if it has changed)
    if (displayName !== user.displayName) {
      try {
        await updateProfile(auth.currentUser, { displayName });
      } catch (err) {
        console.error(err);
        setMessage("Failed to update name: " + err.message);
        return;
      }
    }

    // Save calorie goal to localStorage
    try {
      const goalNumber = parseInt(dailyCalorieGoal, 10);
      if (isNaN(goalNumber) || goalNumber < 0) {
        setMessage("Daily calorie goal must be a non-negative number.");
        return;
      }
      const settingsToSave = { displayName, dailyCalorieGoal: goalNumber };
      localStorage.setItem(storageKey, JSON.stringify(settingsToSave));
      setMessage("Settings saved.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save settings: " + err.message);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">User Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSave}>
          {/* Grid container: 3 columns */}
          <div className="profile-form">
            <label>
              Email:
              <input
                className="form-input"
                type="email"
                value={user.email}
                disabled
              />
            </label>

            <label>
              Display Name:
              <input
                className="form-input"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </label>

            <label>
              Daily Calorie Goal (kcal/day):
              <input
                className="form-input"
                type="number"
                value={dailyCalorieGoal}
                onChange={(e) => setDailyCalorieGoal(e.target.value)}
                required
                min={0}
              />
            </label>

            {/* Password fields taking full width (2 columns) */}
            <label className="full-width">
              New Password:
              <input
                className="form-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to remain unchanged"
              />
            </label>

            <label className="full-width">
              Confirm New Password:
              <input
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat the new password"
              />
            </label>
          </div>

          {/* Error/success message */}
          {message && (
            <p
              style={{
                color: message.startsWith("Failed") ? "red" : "green",
                marginBottom: "1rem",
              }}
            >
              {message}
            </p>
          )}

          <button className="btn btn-primary" type="submit">
            Save Changes
          </button>
        </form>
      )}

      <button
        className="btn btn-danger"
        onClick={logout}
        style={{ marginTop: "20px" }}
      >
        Logout
      </button>
    </div>
  );
}
