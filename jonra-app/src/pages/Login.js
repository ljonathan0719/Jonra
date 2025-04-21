import axios from "axios";
import React, { useState } from "react";
import { authLogin, authSignup } from "../api/auth";
import "./login-page-style.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [activeTab, setActiveTab] = useState("login");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const res = await authLogin(formData);
      setMessage("Login successful!");
      localStorage.setItem("username", formData.username);
      window.location.href = `/home/${formData.username}`;
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Please check your credentials.");
    }
  };

  const handleSignup = async () => {
    try {
      const res = await authSignup(formData);
      setMessage("Signup successful! You can now log in.");
      setActiveTab("login");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-tabs">
          <button
            className={`login-tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`login-tab-button ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "login" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="login-form"
          >
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="login-input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
            />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        )}

        {activeTab === "signup" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
            className="login-form"
          >
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="login-input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
            />
            <button type="submit" className="login-button">
              Sign Up
            </button>
          </form>
        )}

        {message && <div className="login-message">{message}</div>}
      </div>
    </div>
  );
}