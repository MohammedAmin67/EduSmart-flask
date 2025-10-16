import React, { createContext, useContext, useState, useEffect } from "react";
import { userData as mockUserData } from "../../data/mockData";
import { useAvatarUpload } from "../../hooks/useAvatarUpload";
import API from "../../api/axios"; 

const UserContext = createContext();

function mergeUserWithMock(user) {
  if (!user) return null;
  return {
    ...mockUserData,
    ...user,
    stats: { ...mockUserData.stats, ...(user.stats || {}) }
  };
}

export const UserProvider = ({ children }) => {
  const [user, setUserRaw] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return mergeUserWithMock(savedUser ? JSON.parse(savedUser) : null);
  });

  // Listen for force-logout event from axios interceptor
  useEffect(() => {
    const handleForceLogout = () => setUser(null);
    window.addEventListener("force-logout", handleForceLogout);
    return () => window.removeEventListener("force-logout", handleForceLogout);
  }, []);

  // This is your setUser function
  const setUser = (u) => {
    const merged = mergeUserWithMock(u);
    setUserRaw(merged);
    if (merged) localStorage.setItem("user", JSON.stringify(merged));
    else localStorage.removeItem("user");
  };

  // FIXED: Only check session once on mount, with better error handling
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    // Only check session if we have both token and user
    if (!token || !savedUser) {
      setUser(null);
      return;
    }

    const checkSession = async () => {
      try {
        const res = await API.get("/users/me");
        // Only update if we got valid data
        if (res.data) {
          setUser(res.data);
        }
      } catch (err) {
        // Only logout if it's actually a 401 (unauthorized)
        if (err.response?.status === 401) {
          console.log("Session expired, logging out");
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        } else {
          // For other errors (network, 500, etc), keep user logged in
          console.warn("Session check failed, but keeping user logged in:", err.message);
        }
      }
    };

    checkSession();
  }, []); // Only run once on mount

  const uploadAvatar = useAvatarUpload();

  const updateAvatar = async (file) => {
    try {
      const updatedData = await uploadAvatar(file);
      if (!updatedData) throw new Error("No data from avatar upload");
      
      // FIXED: Merge the updated data properly
      const updatedUser = {
        ...user,
        ...updatedData,
        avatar: updatedData.avatar
      };
      
      setUser(updatedUser);
      return updatedData; // Return so caller knows it succeeded
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error; // Re-throw so component can show error
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);