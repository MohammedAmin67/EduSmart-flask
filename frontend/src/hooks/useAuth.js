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
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      localStorage.setItem("isLoggedIn", "true");
      setUser(mergedUser);
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
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
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      localStorage.setItem("isLoggedIn", "true");
      setUser(mergedUser);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  return { user, loading, error, signup, login, logout, setUser };
};