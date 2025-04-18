import axios from "axios";
import React, { useState } from "react";
import "./login-page-style.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [activeTab, setActiveTab] = useState("login");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    console.log("Login Data:", formData);
    // Add login logic here
  };

  const handleSignup = () => {
    console.log("Signup Data:", formData);
    // Add signup logic here
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
            <button type="submit" className="login-button" onClick={handleLogin}>
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}