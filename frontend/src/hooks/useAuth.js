import { useState } from "react";
import API from "../api/axios.js";
import { userData as mockUserData } from "../data/mockData.js";

function mergeUserWithMock(user) {
  if (!user) return null;
  return {
    ...mockUserData,
    ...user,
    stats: { ...mockUserData.stats, ...(user.stats || {}) }
  };
}

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return mergeUserWithMock(saved ? JSON.parse(saved) : null);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signup = async (form) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/signup", form);
      const mergedUser = mergeUserWithMock(data.user);
      localStorage.setItem("token", data.token); // Changed from "authToken"
      localStorage.setItem("user", JSON.stringify(mergedUser));
      localStorage.setItem("isLoggedIn", "true");
      setUser(mergedUser);
      return { success: true }; // Add return for better handling
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Signup failed";
      setError(errorMsg);
      return { success: false, error: errorMsg }; // Return error
    } finally {
      setLoading(false);
    }
  };

  const login = async (form) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", form);
      const mergedUser = mergeUserWithMock(data.user);
      localStorage.setItem("token", data.token); // Changed from "authToken"
      localStorage.setItem("user", JSON.stringify(mergedUser));
      localStorage.setItem("isLoggedIn", "true");
      setUser(mergedUser);
      return { success: true }; // Add return
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Login failed";
      setError(errorMsg);
      return { success: false, error: errorMsg }; // Return error
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Changed from "authToken"
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  return { user, loading, error, signup, login, logout, setUser };
};