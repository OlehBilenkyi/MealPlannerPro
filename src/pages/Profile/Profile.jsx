import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile, updatePassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import {
  FiUser,
  FiLock,
  FiTarget,
  FiMail,
  FiSave,
  FiLogOut,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const uid = user?.uid;

  const [formData, setFormData] = useState({
    displayName: "",
    dailyCalorieGoal: "2000",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const storageKey = `userSettings_${uid}`;

  useEffect(() => {
    if (!uid) return;

    const loadSettings = () => {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setFormData({
            ...formData,
            displayName: parsed.displayName || user.displayName || "",
            dailyCalorieGoal: parsed.dailyCalorieGoal?.toString() || "2000",
          });
        } catch {
          setDefaultSettings();
        }
      } else {
        setDefaultSettings();
      }
      setLoading(false);
    };

    const setDefaultSettings = () => {
      const defaults = {
        displayName: user.displayName || "",
        dailyCalorieGoal: 2000,
      };
      localStorage.setItem(storageKey, JSON.stringify(defaults));
      setFormData({
        ...formData,
        displayName: defaults.displayName,
        dailyCalorieGoal: "2000",
      });
    };

    loadSettings();
  }, [uid, user.displayName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Password validation
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ text: "Passwords do not match", type: "error" });
        return;
      }
      if (formData.newPassword.length < 6) {
        setMessage({
          text: "Password must be at least 6 characters",
          type: "error",
        });
        return;
      }
      try {
        await updatePassword(auth.currentUser, formData.newPassword);
        setFormData({ ...formData, newPassword: "", confirmPassword: "" });
        setMessage({ text: "Password updated successfully", type: "success" });
      } catch (err) {
        setMessage({
          text: `Password update failed: ${err.message}`,
          type: "error",
        });
        return;
      }
    }

    // Update display name if changed
    if (formData.displayName !== user.displayName) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
        });
        setMessage((prev) => ({
          text: prev.text
            ? `${prev.text} Display name updated`
            : "Display name updated",
          type: "success",
        }));
      } catch (err) {
        setMessage({
          text: `Name update failed: ${err.message}`,
          type: "error",
        });
        return;
      }
    }

    // Save calorie goal
    try {
      const goalNumber = parseInt(formData.dailyCalorieGoal, 10);
      if (isNaN(goalNumber) || goalNumber < 1000 || goalNumber > 10000) {
        setMessage({
          text: "Calorie goal must be between 1000-10000",
          type: "error",
        });
        return;
      }

      const settingsToSave = {
        displayName: formData.displayName,
        dailyCalorieGoal: goalNumber,
      };
      localStorage.setItem(storageKey, JSON.stringify(settingsToSave));
      setMessage((prev) => ({
        text: prev.text ? `${prev.text} Settings saved` : "Settings saved",
        type: "success",
      }));
    } catch (err) {
      setMessage({ text: `Save failed: ${err.message}`, type: "error" });
    }
  };

  if (!user) return <div className="loading-spinner" />;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="avatar">
          <FiUser size={24} />
        </div>
        <div>
          <h1>Profile Settings</h1>
          <p>Manage your account preferences</p>
        </div>
      </header>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-section">
            <h2>
              <FiUser size={18} /> Basic Information
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="disabled-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <div className="input-group">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Daily Calorie Goal</label>
              <div className="input-group">
                <FiTarget className="input-icon" />
                <input
                  type="number"
                  name="dailyCalorieGoal"
                  value={formData.dailyCalorieGoal}
                  onChange={handleChange}
                  min="1000"
                  max="10000"
                  step="50"
                  required
                />
                <span className="input-suffix">kcal</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>
              <FiLock size={18} /> Password Change
            </h2>
            <div className="form-group">
              <label>New Password</label>
              <div className="input-group">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-group">
                <FiLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat new password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FiSave /> Save Changes
            </button>
            <button type="button" className="logout-btn" onClick={logout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
