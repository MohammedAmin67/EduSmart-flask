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
    
    // Save to localStorage first
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(mergedUser));
    localStorage.setItem("isLoggedIn", "true");
    
    // Small delay to ensure token is available
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setUser(mergedUser);
    return { success: true };
  } catch (err) {
    const errorMsg = err.response?.data?.msg || "Signup failed";
    setError(errorMsg);
    return { success: false, error: errorMsg };
  } finally {
    setLoading(false);
  }
};

 const login = async (form) => {
  setLoading(true);
  setError("");
  try {
    const { data } = await API.post("/auth/login", form);
    
    console.log("✅ Login response:", data);
    console.log("🔑 Token received:", data.token?.substring(0, 20) + "...");
    
    const mergedUser = mergeUserWithMock(data.user);
    
    // Save to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(mergedUser));
    localStorage.setItem("isLoggedIn", "true");
    
    console.log("💾 Token saved to localStorage");
    console.log("✅ Verification - token exists:", !!localStorage.getItem("token"));
    
    setUser(mergedUser);
    
    // Force page reload to ensure token is available everywhere
    window.location.reload();
    
    return { success: true };
  } catch (err) {
    const errorMsg = err.response?.data?.msg || "Login failed";
    setError(errorMsg);
    return { success: false, error: errorMsg };
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