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

  // REMOVED: The checkSession useEffect that was causing slow logins

  const uploadAvatar = useAvatarUpload();

  const updateAvatar = async (file) => {
    try {
      const updatedData = await uploadAvatar(file);
      if (!updatedData) throw new Error("No data from avatar upload");
      
      // Update user with new avatar
      const updatedUser = {
        ...user,
        ...updatedData,
        avatar: updatedData.avatar
      };
      
      setUser(updatedUser);
      return updatedData;
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);